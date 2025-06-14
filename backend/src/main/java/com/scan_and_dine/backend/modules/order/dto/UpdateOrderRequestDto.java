package com.scan_and_dine.backend.modules.order.dto;

import com.scan_and_dine.backend.modules.order.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderRequestDto {
    private Order.OrderStatus status;
    private Order.OrderPriority priority;
    private String specialInstructions;
    private BigDecimal tip;
    private BigDecimal tax;
    private BigDecimal discount;
    private Order.PaymentStatus paymentStatus;
    private Order.PaymentMethod paymentMethod;
    private LocalDateTime estimatedReadyTime;
} 