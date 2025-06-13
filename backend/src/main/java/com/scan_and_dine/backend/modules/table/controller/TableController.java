package com.scan_and_dine.backend.modules.table.controller;

import com.scan_and_dine.backend.modules.table.dto.CreateTableRequestDto;
import com.scan_and_dine.backend.modules.table.dto.TableResponseDto;
import com.scan_and_dine.backend.modules.table.dto.UpdateTableRequestDto;
import com.scan_and_dine.backend.modules.table.dto.SeatCustomersRequestDto;
import com.scan_and_dine.backend.modules.table.dto.BulkStatusUpdateRequestDto;
import com.scan_and_dine.backend.modules.table.entity.Table;
import com.scan_and_dine.backend.modules.table.service.TableService;
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
@RequestMapping("/tables")
@RequiredArgsConstructor
@Slf4j
public class TableController {

    private final TableService tableService;

    @PostMapping(value = {"", "/"})
    public ResponseEntity<TableResponseDto> createTable(@Valid @RequestBody CreateTableRequestDto requestDto) {
        log.info("Creating new table with number: {}", requestDto.getNumber());
        TableResponseDto table = tableService.createTable(requestDto);
        return new ResponseEntity<>(table, HttpStatus.CREATED);
    }

    @GetMapping(value = {"", "/"})
    public ResponseEntity<Page<TableResponseDto>> getAllTables(
            @RequestParam(required = false) String number,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Table.TableStatus status,
            @RequestParam(required = false) Boolean isOccupied,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "number") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.info("Fetching tables with filters and pagination: page={}, size={}, sortBy={}, sortDir={}", 
                page, size, sortBy, sortDir);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TableResponseDto> tables = tableService.getAllTables(number, location, status, isOccupied, pageable);
        
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableResponseDto> getTableById(@PathVariable UUID id) {
        log.info("Fetching table by ID: {}", id);
        TableResponseDto table = tableService.getTableById(id);
        return ResponseEntity.ok(table);
    }

    @GetMapping("/number/{number}")
    public ResponseEntity<TableResponseDto> getTableByNumber(@PathVariable String number) {
        log.info("Fetching table by number: {}", number);
        TableResponseDto table = tableService.getTableByNumber(number);
        return ResponseEntity.ok(table);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TableResponseDto>> getTablesByStatus(@PathVariable Table.TableStatus status) {
        log.info("Fetching tables by status: {}", status);
        List<TableResponseDto> tables = tableService.getTablesByStatus(status);
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/available")
    public ResponseEntity<List<TableResponseDto>> getAvailableTables() {
        log.info("Fetching available tables");
        List<TableResponseDto> tables = tableService.getAvailableTables();
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TableResponseDto>> searchTables(@RequestParam String query) {
        log.info("Searching tables with query: {}", query);
        List<TableResponseDto> tables = tableService.searchTables(query);
        return ResponseEntity.ok(tables);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TableResponseDto> updateTable(
            @PathVariable UUID id, 
            @Valid @RequestBody UpdateTableRequestDto requestDto) {
        log.info("Updating table with ID: {}", id);
        TableResponseDto table = tableService.updateTable(id, requestDto);
        return ResponseEntity.ok(table);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TableResponseDto> updateTableStatus(
            @PathVariable UUID id, 
            @RequestBody Map<String, String> statusUpdate) {
        log.info("Updating table status for ID: {}", id);
        
        Table.TableStatus status = Table.TableStatus.valueOf(statusUpdate.get("status"));
        TableResponseDto table = tableService.updateTableStatus(id, status);
        
        return ResponseEntity.ok(table);
    }

    @PatchMapping("/{id}/seat")
    public ResponseEntity<TableResponseDto> seatCustomers(
            @PathVariable UUID id,
            @Valid @RequestBody SeatCustomersRequestDto requestDto) {
        log.info("Seating customers at table ID: {}", id);
        
        TableResponseDto table = tableService.seatCustomers(id, requestDto.getCustomerCount());
        
        return ResponseEntity.ok(table);
    }

    @GetMapping("/{id}/qr-code")
    public ResponseEntity<Map<String, String>> generateQRCode(@PathVariable UUID id) {
        log.info("Generating QR code for table ID: {}", id);
        String qrCodeData = tableService.generateQRCode(id);
        return ResponseEntity.ok(Map.of("qrCode", qrCodeData));
    }

    @PatchMapping("/bulk-status")
    public ResponseEntity<List<TableResponseDto>> bulkUpdateStatus(
            @Valid @RequestBody BulkStatusUpdateRequestDto requestDto) {
        log.info("Bulk updating table status");
        
        List<TableResponseDto> tables = tableService.bulkUpdateStatus(
                requestDto.getTableIds(), requestDto.getStatus());
        
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getTableStatistics() {
        log.info("Fetching table statistics");
        Map<String, Long> statistics = tableService.getTableStatistics();
        return ResponseEntity.ok(statistics);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable UUID id) {
        log.info("Deleting table with ID: {}", id);
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
} 