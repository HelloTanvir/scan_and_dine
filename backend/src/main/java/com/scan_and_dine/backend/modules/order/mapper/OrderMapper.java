package com.scan_and_dine.backend.modules.order.mapper;

import com.scan_and_dine.backend.modules.order.dto.CreateOrderRequestDto;
import com.scan_and_dine.backend.modules.order.dto.OrderResponseDto;
import com.scan_and_dine.backend.modules.order.dto.UpdateOrderRequestDto;
import com.scan_and_dine.backend.modules.order.entity.Order;
import com.scan_and_dine.backend.modules.order.entity.OrderItem;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "tableId", source = "table.id")
    @Mapping(target = "tableNumber", source = "table.number")
    @Mapping(target = "orderItems", source = "orderItems")
    OrderResponseDto toResponseDto(Order order);

    @Mapping(target = "menuItemId", source = "menuItem.id")
    @Mapping(target = "menuItemName", source = "menuItem.name")
    @Mapping(target = "menuItemImageUrl", source = "menuItem.imageUrl")
    OrderResponseDto.OrderItemResponseDto toOrderItemResponseDto(OrderItem orderItem);

    List<OrderResponseDto.OrderItemResponseDto> toOrderItemResponseDtoList(List<OrderItem> orderItems);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "table", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "priority", ignore = true)
    @Mapping(target = "tip", ignore = true)
    @Mapping(target = "tax", ignore = true)
    @Mapping(target = "discount", ignore = true)
    @Mapping(target = "paymentStatus", ignore = true)
    @Mapping(target = "paymentMethod", ignore = true)
    @Mapping(target = "estimatedReadyTime", ignore = true)
    @Mapping(target = "actualReadyTime", ignore = true)
    @Mapping(target = "servedTime", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Order toEntity(CreateOrderRequestDto requestDto);

    @AfterMapping
    default void setDefaults(@MappingTarget Order order, CreateOrderRequestDto requestDto) {
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPriority(Order.OrderPriority.MEDIUM);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerName", ignore = true)
    @Mapping(target = "customerPhone", ignore = true)
    @Mapping(target = "customerEmail", ignore = true)
    @Mapping(target = "table", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "actualReadyTime", ignore = true)
    @Mapping(target = "servedTime", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateOrderRequestDto requestDto, @MappingTarget Order order);
} 