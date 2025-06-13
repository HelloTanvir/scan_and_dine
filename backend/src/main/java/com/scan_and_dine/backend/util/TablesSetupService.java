package com.scan_and_dine.backend.util;

import com.scan_and_dine.backend.modules.table.entity.Table;
import com.scan_and_dine.backend.modules.table.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class TablesSetupService implements CommandLineRunner {

    private final TableRepository tableRepository;

    @Override
    public void run(String... args) {
        createSampleTablesIfNotExists();
    }

    private void createSampleTablesIfNotExists() {
        if (tableRepository.count() > 0) {
            log.info("Sample tables already exist, skipping creation");
            return;
        }

        log.info("Creating sample tables...");

        List<Table> sampleTables = Arrays.asList(
            createTable("1", 4, "Window", Arrays.asList("High Chair Available"), Table.TableStatus.AVAILABLE),
            createTable("2", 2, "Corner", Arrays.asList("Wheelchair Accessible"), Table.TableStatus.AVAILABLE),
            createTable("3", 6, "Center", Arrays.asList(), Table.TableStatus.OCCUPIED, 4, "ORD-1001", BigDecimal.valueOf(520.00)),
            createTable("4", 8, "Private Room", Arrays.asList("Private Dining", "Sound System"), Table.TableStatus.CLEANING),
            createTable("5", 4, "Window", Arrays.asList("High Chair Available"), Table.TableStatus.OCCUPIED, 3, "ORD-1002", BigDecimal.valueOf(350.00)),
            createTable("6", 4, "Patio", Arrays.asList("Outdoor", "Umbrella"), Table.TableStatus.AVAILABLE),
            createTable("7", 2, "Bar", Arrays.asList("High Table"), Table.TableStatus.RESERVED),
            createTable("8", 6, "Center", Arrays.asList(), Table.TableStatus.AVAILABLE),
            createTable("9", 4, "Window", Arrays.asList(), Table.TableStatus.MAINTENANCE),
            createTable("10", 2, "Corner", Arrays.asList("Quiet Zone"), Table.TableStatus.AVAILABLE),
            createTable("11", 8, "Banquet", Arrays.asList("Private Dining", "Sound System", "Projector"), Table.TableStatus.AVAILABLE),
            createTable("12", 4, "Center", Arrays.asList(), Table.TableStatus.OCCUPIED, 2, "ORD-1003", BigDecimal.valueOf(280.00)),
            createTable("13", 6, "Patio", Arrays.asList("Outdoor", "Heater"), Table.TableStatus.AVAILABLE),
            createTable("14", 2, "Bar", Arrays.asList("High Table"), Table.TableStatus.AVAILABLE),
            createTable("15", 4, "Window", Arrays.asList("High Chair Available"), Table.TableStatus.AVAILABLE)
        );

        tableRepository.saveAll(sampleTables);
        log.info("Created {} sample tables successfully", sampleTables.size());
    }

    private Table createTable(String number, Integer capacity, String location, 
                             List<String> features, Table.TableStatus status) {
        return createTable(number, capacity, location, features, status, null, null, null);
    }

    private Table createTable(String number, Integer capacity, String location, 
                             List<String> features, Table.TableStatus status,
                             Integer currentCustomers, String currentOrder, BigDecimal totalAmount) {
        Table table = new Table();
        table.setNumber(number);
        table.setCapacity(capacity);
        table.setLocation(location);
        table.setFeatures(features);
        table.setStatus(status);
        table.setIsOccupied(status == Table.TableStatus.OCCUPIED);
        table.setQrCode("QR-TABLE-" + number + "-" + System.currentTimeMillis());
        table.setLastCleaned(LocalDateTime.now().minusHours((long) (Math.random() * 6)));

        if (status == Table.TableStatus.OCCUPIED) {
            table.setCurrentCustomers(currentCustomers);
            table.setCurrentOrder(currentOrder);
            table.setSessionStartTime(LocalDateTime.now().minusMinutes((long) (Math.random() * 120)));
            table.setTotalSessionAmount(totalAmount);
        }

        return table;
    }
} 