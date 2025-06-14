package com.scan_and_dine.backend.modules.order.dto;

import com.scan_and_dine.backend.modules.order.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private UUID id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private UUID tableId;
    private String tableNumber;
    private List<OrderItemResponseDto> orderItems;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private Order.OrderPriority priority;
    private String specialInstructions;
    private BigDecimal tip;
    private BigDecimal tax;
    private BigDecimal discount;
    private Order.PaymentStatus paymentStatus;
    private Order.PaymentMethod paymentMethod;
    private LocalDateTime estimatedReadyTime;
    private LocalDateTime actualReadyTime;
    private LocalDateTime servedTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponseDto {
        private UUID id;
        private UUID menuItemId;
        private String menuItemName;
        private String menuItemImageUrl;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private String specialInstructions;
        private LocalDateTime createdAt;
    }
} 