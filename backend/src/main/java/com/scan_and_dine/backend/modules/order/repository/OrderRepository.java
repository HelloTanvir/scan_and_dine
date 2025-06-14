package com.scan_and_dine.backend.modules.order.repository;

import com.scan_and_dine.backend.modules.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Query(value = "SELECT * FROM orders o WHERE " +
           "(:customerName IS NULL OR UPPER(o.customer_name) ILIKE UPPER('%' || :customerName || '%')) AND " +
           "(:customerPhone IS NULL OR o.customer_phone ILIKE '%' || :customerPhone || '%') AND " +
           "(:tableId IS NULL OR o.table_id = :tableId) AND " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:priority IS NULL OR o.priority = :priority) AND " +
           "(:paymentStatus IS NULL OR o.payment_status = :paymentStatus)",
           nativeQuery = true)
    Page<Order> findOrdersWithFilters(@Param("customerName") String customerName,
                                     @Param("customerPhone") String customerPhone,
                                     @Param("tableId") UUID tableId,
                                     @Param("status") String status,
                                     @Param("priority") String priority,
                                     @Param("paymentStatus") String paymentStatus,
                                     Pageable pageable);

    List<Order> findByStatus(Order.OrderStatus status);

    List<Order> findByStatusIn(List<Order.OrderStatus> statuses);

    List<Order> findByPriority(Order.OrderPriority priority);

    List<Order> findByPaymentStatus(Order.PaymentStatus paymentStatus);

    @Query("SELECT o FROM Order o WHERE o.table.id = :tableId")
    List<Order> findByTableId(@Param("tableId") UUID tableId);

    @Query("SELECT o FROM Order o WHERE o.table.number = :tableNumber")
    List<Order> findByTableNumber(@Param("tableNumber") String tableNumber);

    @Query("SELECT o FROM Order o WHERE o.customerPhone = :customerPhone")
    List<Order> findByCustomerPhone(@Param("customerPhone") String customerPhone);

    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM Order o WHERE o.status IN ('PENDING', 'CONFIRMED', 'PREPARING') ORDER BY o.priority DESC, o.createdAt ASC")
    List<Order> findActiveOrdersForKitchen();

    @Query("SELECT o FROM Order o WHERE o.status = 'READY' ORDER BY o.actualReadyTime ASC")
    List<Order> findReadyOrders();

    @Modifying
    @Query(value = "UPDATE orders SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id IN :orderIds", nativeQuery = true)
    int bulkUpdateStatus(@Param("orderIds") List<UUID> orderIds, @Param("status") String status);

    @Modifying
    @Query(value = "UPDATE orders SET priority = :priority, updated_at = CURRENT_TIMESTAMP WHERE id IN :orderIds", nativeQuery = true)
    int bulkUpdatePriority(@Param("orderIds") List<UUID> orderIds, @Param("priority") String priority);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") Order.OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.priority = :priority")
    long countByPriority(@Param("priority") Order.OrderPriority priority);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus = :paymentStatus")
    long countByPaymentStatus(@Param("paymentStatus") Order.PaymentStatus paymentStatus);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID' AND o.createdAt >= :startDate")
    Double getTotalRevenueSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT AVG(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID'")
    Double getAverageOrderValue();

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> getOrderCountByStatus();

    @Query("SELECT o.priority, COUNT(o) FROM Order o GROUP BY o.priority")
    List<Object[]> getOrderCountByPriority();
} 