package com.scan_and_dine.backend.modules.menu.repository;

import com.scan_and_dine.backend.modules.menu.entity.Menu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MenuRepository extends JpaRepository<Menu, UUID> {

    Optional<Menu> findByName(String name);

    boolean existsByName(String name);

    @Query(value = "SELECT * FROM menu_items m WHERE " +
           "(:name IS NULL OR UPPER(m.name) ILIKE UPPER('%' || :name || '%')) AND " +
           "(:category IS NULL OR m.category = :category) AND " +
           "(:isAvailable IS NULL OR m.is_available = :isAvailable) AND " +
           "(:isFeatured IS NULL OR m.is_featured = :isFeatured) AND " +
           "(:minPrice IS NULL OR m.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR m.price <= :maxPrice)",
           nativeQuery = true)
    Page<Menu> findMenuItemsWithFilters(@Param("name") String name,
                                       @Param("category") String category,
                                       @Param("isAvailable") Boolean isAvailable,
                                       @Param("isFeatured") Boolean isFeatured,
                                       @Param("minPrice") BigDecimal minPrice,
                                       @Param("maxPrice") BigDecimal maxPrice,
                                       Pageable pageable);

    List<Menu> findByCategory(Menu.MenuCategory category);

    List<Menu> findByIsAvailable(Boolean isAvailable);

    List<Menu> findByIsFeatured(Boolean isFeatured);

    @Query("SELECT m FROM Menu m WHERE m.category = :category AND m.isAvailable = true")
    List<Menu> findAvailableMenuItemsByCategory(@Param("category") Menu.MenuCategory category);

    @Query("SELECT m FROM Menu m WHERE m.isAvailable = true AND m.isFeatured = true")
    List<Menu> findFeaturedMenuItems();

    @Query("SELECT m FROM Menu m WHERE m.price BETWEEN :minPrice AND :maxPrice")
    List<Menu> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                               @Param("maxPrice") BigDecimal maxPrice);

    @Query(value = "SELECT * FROM menu_items m WHERE " +
           "UPPER(m.name) ILIKE UPPER('%' || :query || '%') OR " +
           "UPPER(m.description) ILIKE UPPER('%' || :query || '%')",
           nativeQuery = true)
    List<Menu> searchMenuItems(@Param("query") String query);

    @Modifying
    @Query(value = "UPDATE menu_items SET is_available = :isAvailable, updated_at = CURRENT_TIMESTAMP WHERE id IN :menuIds", nativeQuery = true)
    int bulkUpdateAvailability(@Param("menuIds") List<UUID> menuIds, @Param("isAvailable") Boolean isAvailable);

    @Modifying
    @Query(value = "UPDATE menu_items SET is_featured = :isFeatured, updated_at = CURRENT_TIMESTAMP WHERE id IN :menuIds", nativeQuery = true)
    int bulkUpdateFeaturedStatus(@Param("menuIds") List<UUID> menuIds, @Param("isFeatured") Boolean isFeatured);

    @Query("SELECT COUNT(m) FROM Menu m WHERE m.category = :category")
    long countByCategory(@Param("category") Menu.MenuCategory category);

    @Query("SELECT COUNT(m) FROM Menu m WHERE m.isAvailable = true")
    long countAvailableMenuItems();

    @Query("SELECT COUNT(m) FROM Menu m WHERE m.isFeatured = true")
    long countFeaturedMenuItems();

    @Query("SELECT COUNT(m) FROM Menu m")
    long countTotalMenuItems();

    @Query("SELECT AVG(m.price) FROM Menu m WHERE m.isAvailable = true")
    BigDecimal findAveragePrice();

    @Query("SELECT m.category, COUNT(m) FROM Menu m GROUP BY m.category")
    List<Object[]> getMenuItemCountByCategory();
} 