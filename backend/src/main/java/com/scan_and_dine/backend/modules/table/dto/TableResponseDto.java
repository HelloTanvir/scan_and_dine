package com.scan_and_dine.backend.modules.table.dto;

import com.scan_and_dine.backend.modules.table.entity.Table;
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
public class TableResponseDto {
    private UUID id;
    private String number;
    private Integer capacity;
    private Table.TableStatus status;
    private Boolean isOccupied;
    private String qrCode;
    private String location;
    private List<String> features;
    private Integer currentCustomers;
    private String currentOrder;
    private String currentReservation;
    private LocalDateTime sessionStartTime;
    private BigDecimal totalSessionAmount;
    private LocalDateTime lastCleaned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 