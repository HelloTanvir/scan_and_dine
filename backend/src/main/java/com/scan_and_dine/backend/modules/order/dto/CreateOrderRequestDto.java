package com.scan_and_dine.backend.modules.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDto {
    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @Email(message = "Customer email should be valid")
    private String customerEmail;

    @NotNull(message = "Table ID is required")
    private UUID tableId;

    @NotEmpty(message = "Order items cannot be empty")
    @Valid
    private List<CreateOrderItemDto> orderItems;

    private String specialInstructions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateOrderItemDto {
        @NotNull(message = "Menu item ID is required")
        private UUID menuItemId;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        private String specialInstructions;
    }
} 