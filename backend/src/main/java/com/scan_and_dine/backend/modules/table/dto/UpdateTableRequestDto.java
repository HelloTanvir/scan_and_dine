package com.scan_and_dine.backend.modules.table.dto;

import com.scan_and_dine.backend.modules.table.entity.Table;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTableRequestDto {
    @Size(max = 10, message = "Table number cannot exceed 10 characters")
    private String number;

    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    private List<String> features;

    private Table.TableStatus status;

    private Integer currentCustomers;

    private String currentOrder;

    private String currentReservation;

    @Positive(message = "Total session amount must be positive")
    private BigDecimal totalSessionAmount;
} 