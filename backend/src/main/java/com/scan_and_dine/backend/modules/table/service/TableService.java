package com.scan_and_dine.backend.modules.table.service;

import com.scan_and_dine.backend.exception.DuplicateResourceException;
import com.scan_and_dine.backend.exception.ResourceNotFoundException;
import com.scan_and_dine.backend.modules.table.dto.CreateTableRequestDto;
import com.scan_and_dine.backend.modules.table.dto.TableResponseDto;
import com.scan_and_dine.backend.modules.table.dto.UpdateTableRequestDto;
import com.scan_and_dine.backend.modules.table.entity.Table;
import com.scan_and_dine.backend.modules.table.mapper.TableMapper;
import com.scan_and_dine.backend.modules.table.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TableService {

    private final TableRepository tableRepository;
    private final TableMapper tableMapper;

    public TableResponseDto createTable(CreateTableRequestDto requestDto) {
        log.info("Creating table with number: {}", requestDto.getNumber());
        
        if (tableRepository.existsByNumber(requestDto.getNumber())) {
            throw new DuplicateResourceException("Table number already exists: " + requestDto.getNumber());
        }
        
        Table table = tableMapper.toEntity(requestDto);
        Table savedTable = tableRepository.save(table);
        
        log.info("Table created successfully with ID: {}", savedTable.getId());
        return tableMapper.toResponseDto(savedTable);
    }

    @Transactional(readOnly = true)
    public TableResponseDto getTableById(UUID id) {
        log.info("Fetching table by ID: {}", id);
        Table table = findTableById(id);
        return tableMapper.toResponseDto(table);
    }

    @Transactional(readOnly = true)
    public TableResponseDto getTableByNumber(String number) {
        log.info("Fetching table by number: {}", number);
        Table table = tableRepository.findByNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with number: " + number));
        return tableMapper.toResponseDto(table);
    }

    @Transactional(readOnly = true)
    public Page<TableResponseDto> getAllTables(String number, String location, 
                                             Table.TableStatus status, Boolean isOccupied, 
                                             Pageable pageable) {
        log.info("Fetching tables with filters and pagination");
        String statusStr = status != null ? status.name() : null;
        return tableRepository.findTablesWithFilters(number, location, statusStr, isOccupied, pageable)
                .map(tableMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public List<TableResponseDto> getTablesByStatus(Table.TableStatus status) {
        log.info("Fetching tables with status: {}", status);
        return tableRepository.findByStatus(status)
                .stream()
                .map(tableMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TableResponseDto> getAvailableTables() {
        log.info("Fetching available tables");
        return tableRepository.findByIsOccupied(false)
                .stream()
                .map(tableMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TableResponseDto> searchTables(String query) {
        log.info("Searching tables with query: {}", query);
        return tableRepository.searchTables(query)
                .stream()
                .map(tableMapper::toResponseDto)
                .toList();
    }

    public TableResponseDto updateTable(UUID id, UpdateTableRequestDto requestDto) {
        log.info("Updating table with ID: {}", id);
        
        Table existingTable = findTableById(id);
        
        // Check for duplicate table number if updating
        if (requestDto.getNumber() != null && 
            !requestDto.getNumber().equals(existingTable.getNumber()) &&
            tableRepository.existsByNumber(requestDto.getNumber())) {
            throw new DuplicateResourceException("Table number already exists: " + requestDto.getNumber());
        }
        
        tableMapper.updateEntityFromDto(requestDto, existingTable);
        Table updatedTable = tableRepository.save(existingTable);
        
        log.info("Table updated successfully with ID: {}", updatedTable.getId());
        return tableMapper.toResponseDto(updatedTable);
    }

    public TableResponseDto updateTableStatus(UUID id, Table.TableStatus status) {
        log.info("Updating table status with ID: {} to status: {}", id, status);
        
        Table table = findTableById(id);
        table.setStatus(status);
        table.setIsOccupied(status == Table.TableStatus.OCCUPIED);
        
        // Clear session data when table becomes available
        if (status == Table.TableStatus.AVAILABLE) {
            clearTableSession(table);
        }
        
        // Set session start time when occupied
        if (status == Table.TableStatus.OCCUPIED && table.getSessionStartTime() == null) {
            table.setSessionStartTime(LocalDateTime.now());
            table.setTotalSessionAmount(BigDecimal.ZERO);
        }
        
        // Update last cleaned time for cleaning status
        if (status == Table.TableStatus.CLEANING) {
            table.setLastCleaned(LocalDateTime.now());
        }
        
        Table updatedTable = tableRepository.save(table);
        log.info("Table status updated successfully");
        return tableMapper.toResponseDto(updatedTable);
    }

    public TableResponseDto seatCustomers(UUID id, Integer customerCount) {
        log.info("Seating {} customers at table ID: {}", customerCount, id);
        
        Table table = findTableById(id);
        
        if (table.getIsOccupied()) {
            throw new IllegalStateException("Table is already occupied");
        }
        
        table.setStatus(Table.TableStatus.OCCUPIED);
        table.setIsOccupied(true);
        table.setCurrentCustomers(customerCount);
        table.setSessionStartTime(LocalDateTime.now());
        table.setTotalSessionAmount(BigDecimal.ZERO);
        
        Table updatedTable = tableRepository.save(table);
        log.info("Customers seated successfully");
        return tableMapper.toResponseDto(updatedTable);
    }

    public String generateQRCode(UUID id) {
        log.info("Generating QR code for table ID: {}", id);
        
        Table table = findTableById(id);
        String qrCodeData = String.format("http://localhost:3000/order/menu?table=%s", table.getId());
        
        log.info("QR code generated successfully for table: {}", table.getNumber());
        return qrCodeData;
    }

    public List<TableResponseDto> bulkUpdateStatus(List<UUID> tableIds, Table.TableStatus status) {
        log.info("Bulk updating status for {} tables to: {}", tableIds.size(), status);
        
        List<Table> tables = tableRepository.findAllById(tableIds);
        if (tables.size() != tableIds.size()) {
            throw new ResourceNotFoundException("Some tables not found");
        }
        
        tables.forEach(table -> {
            table.setStatus(status);
            table.setIsOccupied(status == Table.TableStatus.OCCUPIED);
            if (status == Table.TableStatus.AVAILABLE) {
                clearTableSession(table);
            }
        });
        
        List<Table> updatedTables = tableRepository.saveAll(tables);
        log.info("Bulk status update completed successfully");
        
        return updatedTables.stream()
                .map(tableMapper::toResponseDto)
                .toList();
    }

    public Map<String, Long> getTableStatistics() {
        log.info("Fetching table statistics");
        
        long totalTables = tableRepository.countTotalTables();
        long occupiedTables = tableRepository.countOccupiedTables();
        long availableTables = tableRepository.countByStatus(Table.TableStatus.AVAILABLE);
        long reservedTables = tableRepository.countByStatus(Table.TableStatus.RESERVED);
        long cleaningTables = tableRepository.countByStatus(Table.TableStatus.CLEANING);
        long maintenanceTables = tableRepository.countByStatus(Table.TableStatus.MAINTENANCE);
        
        return Map.of(
            "total", totalTables,
            "occupied", occupiedTables,
            "available", availableTables,
            "reserved", reservedTables,
            "cleaning", cleaningTables,
            "maintenance", maintenanceTables
        );
    }

    public void deleteTable(UUID id) {
        log.info("Deleting table with ID: {}", id);
        
        Table table = findTableById(id);
        
        if (table.getIsOccupied()) {
            throw new IllegalStateException("Cannot delete occupied table");
        }
        
        tableRepository.deleteById(id);
        log.info("Table deleted successfully with ID: {}", id);
    }

    private Table findTableById(UUID id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with ID: " + id));
    }

    private void clearTableSession(Table table) {
        table.setCurrentCustomers(null);
        table.setCurrentOrder(null);
        table.setCurrentReservation(null);
        table.setSessionStartTime(null);
        table.setTotalSessionAmount(null);
    }
} 