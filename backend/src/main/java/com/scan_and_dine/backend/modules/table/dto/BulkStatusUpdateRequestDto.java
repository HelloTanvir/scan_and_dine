package com.scan_and_dine.backend.modules.table.dto;

import com.scan_and_dine.backend.modules.table.entity.Table;
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
public class BulkStatusUpdateRequestDto {
    @NotEmpty(message = "Table IDs list cannot be empty")
    private List<UUID> tableIds;

    @NotNull(message = "Status is required")
    private Table.TableStatus status;
} 