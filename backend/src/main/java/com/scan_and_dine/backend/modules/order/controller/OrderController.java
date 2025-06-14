package com.scan_and_dine.backend.modules.order.controller;

import com.scan_and_dine.backend.modules.order.dto.CreateOrderRequestDto;
import com.scan_and_dine.backend.modules.order.dto.OrderResponseDto;
import com.scan_and_dine.backend.modules.order.dto.UpdateOrderRequestDto;
import com.scan_and_dine.backend.modules.order.entity.Order;
import com.scan_and_dine.backend.modules.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    @PostMapping(value = {"", "/"})
    public ResponseEntity<OrderResponseDto> createOrder(@Valid @RequestBody CreateOrderRequestDto requestDto) {
        log.info("Creating new order for customer: {}", requestDto.getCustomerName());
        OrderResponseDto order = orderService.createOrder(requestDto);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping(value = {"", "/"})
    public ResponseEntity<Page<OrderResponseDto>> getAllOrders(
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String customerPhone,
            @RequestParam(required = false) UUID tableId,
            @RequestParam(required = false) Order.OrderStatus status,
            @RequestParam(required = false) Order.OrderPriority priority,
            @RequestParam(required = false) Order.PaymentStatus paymentStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        log.info("Fetching orders with filters and pagination: page={}, size={}, sortBy={}, sortDir={}", 
                page, size, sortBy, sortDir);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<OrderResponseDto> orders = orderService.getAllOrders(
                customerName, customerPhone, tableId, status, priority, paymentStatus, pageable);
        
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDto> getOrderById(@PathVariable UUID id) {
        log.info("Fetching order by ID: {}", id);
        OrderResponseDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        log.info("Fetching orders by status: {}", status);
        List<OrderResponseDto> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/kitchen/active")
    public ResponseEntity<List<OrderResponseDto>> getActiveOrdersForKitchen() {
        log.info("Fetching active orders for kitchen");
        List<OrderResponseDto> orders = orderService.getActiveOrdersForKitchen();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/kitchen/ready")
    public ResponseEntity<List<OrderResponseDto>> getReadyOrders() {
        log.info("Fetching ready orders");
        List<OrderResponseDto> orders = orderService.getReadyOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/table/{tableId}")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByTableId(@PathVariable UUID tableId) {
        log.info("Fetching orders for table ID: {}", tableId);
        List<OrderResponseDto> orders = orderService.getOrdersByTableId(tableId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDto> updateOrder(
            @PathVariable UUID id, 
            @Valid @RequestBody UpdateOrderRequestDto requestDto) {
        log.info("Updating order with ID: {}", id);
        OrderResponseDto order = orderService.updateOrder(id, requestDto);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable UUID id, 
            @RequestBody Map<String, String> statusUpdate) {
        log.info("Updating order status for ID: {}", id);
        
        Order.OrderStatus status = Order.OrderStatus.valueOf(statusUpdate.get("status"));
        OrderResponseDto order = orderService.updateOrderStatus(id, status);
        
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/bulk-status")
    public ResponseEntity<List<OrderResponseDto>> bulkUpdateStatus(
            @RequestBody Map<String, Object> bulkUpdate) {
        log.info("Bulk updating order status");
        
        @SuppressWarnings("unchecked")
        List<UUID> orderIds = (List<UUID>) bulkUpdate.get("orderIds");
        Order.OrderStatus status = Order.OrderStatus.valueOf((String) bulkUpdate.get("status"));
        
        List<OrderResponseDto> orders = orderService.bulkUpdateStatus(orderIds, status);
        
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getOrderStatistics() {
        log.info("Fetching order statistics");
        Map<String, Object> statistics = orderService.getOrderStatistics();
        return ResponseEntity.ok(statistics);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID id) {
        log.info("Deleting order with ID: {}", id);
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
} 