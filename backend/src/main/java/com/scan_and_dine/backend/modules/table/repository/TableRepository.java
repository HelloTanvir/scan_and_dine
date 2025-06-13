package com.scan_and_dine.backend.modules.table.repository;

import com.scan_and_dine.backend.modules.table.entity.Table;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TableRepository extends JpaRepository<Table, UUID> {

    Optional<Table> findByNumber(String number);

    boolean existsByNumber(String number);

    @Query(value = "SELECT * FROM tables t WHERE " +
           "(:number IS NULL OR UPPER(t.number) ILIKE UPPER('%' || :number || '%')) AND " +
           "(:location IS NULL OR UPPER(t.location) ILIKE UPPER('%' || :location || '%')) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:isOccupied IS NULL OR t.is_occupied = :isOccupied)",
           nativeQuery = true)
    Page<Table> findTablesWithFilters(@Param("number") String number,
                                     @Param("location") String location,
                                     @Param("status") String status,
                                     @Param("isOccupied") Boolean isOccupied,
                                     Pageable pageable);

    List<Table> findByStatusIn(List<Table.TableStatus> statuses);

    List<Table> findByStatus(Table.TableStatus status);

    List<Table> findByIsOccupied(Boolean isOccupied);

    @Query("SELECT t FROM Table t WHERE t.location = :location")
    List<Table> findByLocation(@Param("location") String location);

    @Query("SELECT t FROM Table t WHERE t.capacity >= :minCapacity AND t.capacity <= :maxCapacity")
    List<Table> findByCapacityBetween(@Param("minCapacity") Integer minCapacity,
                                     @Param("maxCapacity") Integer maxCapacity);

    @Query("SELECT t FROM Table t WHERE t.lastCleaned < :beforeTime")
    List<Table> findTablesNeedingCleaning(@Param("beforeTime") LocalDateTime beforeTime);

    @Query(value = "SELECT * FROM tables t WHERE " +
           "UPPER(t.number) ILIKE UPPER('%' || :query || '%') OR " +
           "UPPER(t.location) ILIKE UPPER('%' || :query || '%')",
           nativeQuery = true)
    List<Table> searchTables(@Param("query") String query);

    @Modifying
    @Query(value = "UPDATE tables SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id IN :tableIds", nativeQuery = true)
    int bulkUpdateStatus(@Param("tableIds") List<UUID> tableIds, @Param("status") String status);

    @Modifying
    @Query(value = "UPDATE tables SET last_cleaned = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = :tableId", nativeQuery = true)
    int updateLastCleaned(@Param("tableId") UUID tableId);

    @Query("SELECT COUNT(t) FROM Table t WHERE t.status = :status")
    long countByStatus(@Param("status") Table.TableStatus status);

    @Query("SELECT COUNT(t) FROM Table t WHERE t.isOccupied = true")
    long countOccupiedTables();

    @Query("SELECT COUNT(t) FROM Table t")
    long countTotalTables();
} 