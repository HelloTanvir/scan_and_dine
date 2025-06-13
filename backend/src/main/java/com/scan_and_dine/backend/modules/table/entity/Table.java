package com.scan_and_dine.backend.modules.table.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@jakarta.persistence.Table(name = "tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Table {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true, columnDefinition = "VARCHAR(10)")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @NotBlank(message = "Table number is required")
    private String number;

    @Column(nullable = false)
    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TableStatus status = TableStatus.AVAILABLE;

    @Column(nullable = false)
    private Boolean isOccupied = false;

    @Column(unique = true, columnDefinition = "VARCHAR(255)")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String qrCode;

    @Column(columnDefinition = "VARCHAR(100)")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String location;

    @ElementCollection
    @CollectionTable(name = "table_features", joinColumns = @JoinColumn(name = "table_id"))
    @Column(name = "feature")
    private List<String> features;

    // Current session data
    private Integer currentCustomers;

    @Column(columnDefinition = "VARCHAR(50)")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String currentOrder;

    @Column(columnDefinition = "VARCHAR(50)")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String currentReservation;

    private LocalDateTime sessionStartTime;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalSessionAmount;

    // Maintenance
    private LocalDateTime lastCleaned;

    @CreationTimestamp
    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public enum TableStatus {
        AVAILABLE, OCCUPIED, RESERVED, CLEANING, MAINTENANCE
    }
} 