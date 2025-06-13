package com.scan_and_dine.backend.modules.table.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTableRequestDto {
    @NotBlank(message = "Table number is required")
    @Size(max = 10, message = "Table number cannot exceed 10 characters")
    private String number;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    private List<String> features;
} 