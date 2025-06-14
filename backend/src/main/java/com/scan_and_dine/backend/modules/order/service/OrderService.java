package com.scan_and_dine.backend.modules.order.service;

import com.scan_and_dine.backend.exception.ResourceNotFoundException;
import com.scan_and_dine.backend.modules.menu.entity.Menu;
import com.scan_and_dine.backend.modules.menu.repository.MenuRepository;
import com.scan_and_dine.backend.modules.order.dto.CreateOrderRequestDto;
import com.scan_and_dine.backend.modules.order.dto.OrderResponseDto;
import com.scan_and_dine.backend.modules.order.dto.UpdateOrderRequestDto;
import com.scan_and_dine.backend.modules.order.entity.Order;
import com.scan_and_dine.backend.modules.order.entity.OrderItem;
import com.scan_and_dine.backend.modules.order.mapper.OrderMapper;
import com.scan_and_dine.backend.modules.order.repository.OrderRepository;
import com.scan_and_dine.backend.modules.table.entity.Table;
import com.scan_and_dine.backend.modules.table.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;
    private final MenuRepository menuRepository;
    private final OrderMapper orderMapper;

    public OrderResponseDto createOrder(CreateOrderRequestDto requestDto) {
        log.info("Creating order for customer: {} at table: {}", 
                requestDto.getCustomerName(), requestDto.getTableId());
        
        // Validate table exists and is available
        Table table = tableRepository.findById(requestDto.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with ID: " + requestDto.getTableId()));
        
        // Create order entity
        Order order = orderMapper.toEntity(requestDto);
        order.setTable(table);
        
        // Create order items and calculate total
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (CreateOrderRequestDto.CreateOrderItemDto itemDto : requestDto.getOrderItems()) {
            Menu menuItem = menuRepository.findById(itemDto.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with ID: " + itemDto.getMenuItemId()));
            
            if (!menuItem.getIsAvailable()) {
                throw new IllegalArgumentException("Menu item is not available: " + menuItem.getName());
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setUnitPrice(menuItem.getPrice());
            orderItem.setTotalPrice(menuItem.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
            orderItem.setSpecialInstructions(itemDto.getSpecialInstructions());
            
            orderItems.add(orderItem);
            totalAmount = totalAmount.add(orderItem.getTotalPrice());
        }
        
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        // Calculate estimated ready time (base time + prep time for all items)
        int totalPrepTime = orderItems.stream()
                .mapToInt(item -> (item.getMenuItem().getPreparationTimeMinutes() != null ? 
                        item.getMenuItem().getPreparationTimeMinutes() : 15) * item.getQuantity())
                .sum();
        order.setEstimatedReadyTime(LocalDateTime.now().plusMinutes(Math.max(totalPrepTime, 10)));
        
        Order savedOrder = orderRepository.save(order);
        
        // Update table status to occupied if not already
        if (table.getStatus() == Table.TableStatus.AVAILABLE) {
            table.setStatus(Table.TableStatus.OCCUPIED);
            table.setIsOccupied(true);
            table.setCurrentOrder(savedOrder.getId().toString());
            if (table.getSessionStartTime() == null) {
                table.setSessionStartTime(LocalDateTime.now());
            }
            tableRepository.save(table);
        }
        
        log.info("Order created successfully with ID: {}", savedOrder.getId());
        return orderMapper.toResponseDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(UUID id) {
        log.info("Fetching order by ID: {}", id);
        Order order = findOrderById(id);
        return orderMapper.toResponseDto(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getAllOrders(String customerName, String customerPhone,
                                             UUID tableId, Order.OrderStatus status,
                                             Order.OrderPriority priority, Order.PaymentStatus paymentStatus,
                                             Pageable pageable) {
        log.info("Fetching orders with filters and pagination");
        String statusStr = status != null ? status.name() : null;
        String priorityStr = priority != null ? priority.name() : null;
        String paymentStatusStr = paymentStatus != null ? paymentStatus.name() : null;
        
        return orderRepository.findOrdersWithFilters(customerName, customerPhone, tableId, 
                statusStr, priorityStr, paymentStatusStr, pageable)
                .map(orderMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByStatus(Order.OrderStatus status) {
        log.info("Fetching orders with status: {}", status);
        return orderRepository.findByStatus(status)
                .stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getActiveOrdersForKitchen() {
        log.info("Fetching active orders for kitchen");
        return orderRepository.findActiveOrdersForKitchen()
                .stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getReadyOrders() {
        log.info("Fetching ready orders");
        return orderRepository.findReadyOrders()
                .stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByTableId(UUID tableId) {
        log.info("Fetching orders for table ID: {}", tableId);
        return orderRepository.findByTableId(tableId)
                .stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    public OrderResponseDto updateOrder(UUID id, UpdateOrderRequestDto requestDto) {
        log.info("Updating order with ID: {}", id);
        
        Order existingOrder = findOrderById(id);
        Order.OrderStatus oldStatus = existingOrder.getStatus();
        
        orderMapper.updateEntityFromDto(requestDto, existingOrder);
        
        // Handle status-specific logic
        if (requestDto.getStatus() != null && requestDto.getStatus() != oldStatus) {
            handleStatusChange(existingOrder, oldStatus, requestDto.getStatus());
        }
        
        Order updatedOrder = orderRepository.save(existingOrder);
        
        log.info("Order updated successfully with ID: {}", updatedOrder.getId());
        return orderMapper.toResponseDto(updatedOrder);
    }

    public OrderResponseDto updateOrderStatus(UUID id, Order.OrderStatus status) {
        log.info("Updating order status with ID: {} to: {}", id, status);
        
        Order order = findOrderById(id);
        Order.OrderStatus oldStatus = order.getStatus();
        
        order.setStatus(status);
        handleStatusChange(order, oldStatus, status);
        
        Order updatedOrder = orderRepository.save(order);
        log.info("Order status updated successfully");
        return orderMapper.toResponseDto(updatedOrder);
    }

    public List<OrderResponseDto> bulkUpdateStatus(List<UUID> orderIds, Order.OrderStatus status) {
        log.info("Bulk updating status for {} orders to: {}", orderIds.size(), status);
        
        List<Order> orders = orderRepository.findAllById(orderIds);
        if (orders.size() != orderIds.size()) {
            throw new ResourceNotFoundException("Some orders not found");
        }
        
        orders.forEach(order -> {
            Order.OrderStatus oldStatus = order.getStatus();
            order.setStatus(status);
            handleStatusChange(order, oldStatus, status);
        });
        
        List<Order> updatedOrders = orderRepository.saveAll(orders);
        log.info("Bulk status update completed successfully");
        
        return updatedOrders.stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    public Map<String, Object> getOrderStatistics() {
        log.info("Fetching order statistics");
        
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalOrders", orderRepository.count());
        statistics.put("todayOrders", orderRepository.countOrdersSince(today));
        statistics.put("pendingOrders", orderRepository.countByStatus(Order.OrderStatus.PENDING));
        statistics.put("preparingOrders", orderRepository.countByStatus(Order.OrderStatus.PREPARING));
        statistics.put("readyOrders", orderRepository.countByStatus(Order.OrderStatus.READY));
        statistics.put("completedOrders", orderRepository.countByStatus(Order.OrderStatus.COMPLETED));
        
        Double todayRevenue = orderRepository.getTotalRevenueSince(today);
        statistics.put("todayRevenue", todayRevenue != null ? todayRevenue : 0.0);
        
        Double avgOrderValue = orderRepository.getAverageOrderValue();
        statistics.put("averageOrderValue", avgOrderValue != null ? avgOrderValue : 0.0);
        
        // Status breakdown
        List<Object[]> statusStats = orderRepository.getOrderCountByStatus();
        Map<String, Long> statusBreakdown = new HashMap<>();
        for (Object[] stat : statusStats) {
            statusBreakdown.put(stat[0].toString(), ((Number) stat[1]).longValue());
        }
        statistics.put("statusBreakdown", statusBreakdown);
        
        // Priority breakdown
        List<Object[]> priorityStats = orderRepository.getOrderCountByPriority();
        Map<String, Long> priorityBreakdown = new HashMap<>();
        for (Object[] stat : priorityStats) {
            priorityBreakdown.put(stat[0].toString(), ((Number) stat[1]).longValue());
        }
        statistics.put("priorityBreakdown", priorityBreakdown);
        
        return statistics;
    }

    public void deleteOrder(UUID id) {
        log.info("Deleting order with ID: {}", id);
        
        Order order = findOrderById(id);
        
        // Only allow deletion of pending or cancelled orders
        if (order.getStatus() != Order.OrderStatus.PENDING && 
            order.getStatus() != Order.OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot delete order with status: " + order.getStatus());
        }
        
        orderRepository.deleteById(id);
        log.info("Order deleted successfully with ID: {}", id);
    }

    private Order findOrderById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
    }

    private void handleStatusChange(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus) {
        switch (newStatus) {
            case CONFIRMED:
                if (oldStatus == Order.OrderStatus.PENDING) {
                    log.info("Order {} confirmed", order.getId());
                }
                break;
            case PREPARING:
                if (oldStatus == Order.OrderStatus.CONFIRMED) {
                    log.info("Order {} started preparing", order.getId());
                }
                break;
            case READY:
                if (oldStatus == Order.OrderStatus.PREPARING) {
                    order.setActualReadyTime(LocalDateTime.now());
                    log.info("Order {} is ready", order.getId());
                }
                break;
            case SERVED:
                if (oldStatus == Order.OrderStatus.READY) {
                    order.setServedTime(LocalDateTime.now());
                    log.info("Order {} served", order.getId());
                }
                break;
            case COMPLETED:
                if (oldStatus == Order.OrderStatus.SERVED) {
                    log.info("Order {} completed", order.getId());
                }
                break;
            case CANCELLED:
                log.info("Order {} cancelled", order.getId());
                break;
        }
    }
} 