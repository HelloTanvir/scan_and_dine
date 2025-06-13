package com.scan_and_dine.backend.modules.table.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatCustomersRequestDto {
    @NotNull(message = "Customer count is required")
    @Positive(message = "Customer count must be positive")
    private Integer customerCount;
} 