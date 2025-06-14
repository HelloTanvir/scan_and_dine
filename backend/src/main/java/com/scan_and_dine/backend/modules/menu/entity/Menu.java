package com.scan_and_dine.backend.modules.menu.entity;

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
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, columnDefinition = "VARCHAR(100)")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @NotBlank(message = "Menu item name is required")
    private String name;

    @Column(columnDefinition = "TEXT")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MenuCategory category;

    @Column(columnDefinition = "VARCHAR(500)")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    @Column(nullable = false)
    private Boolean isFeatured = false;

    @ElementCollection
    @CollectionTable(name = "menu_item_ingredients", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "ingredient")
    private List<String> ingredients;

    @ElementCollection
    @CollectionTable(name = "menu_item_allergens", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "allergen")
    private List<String> allergens;

    @ElementCollection
    @CollectionTable(name = "menu_item_dietary_tags", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "dietary_tag")
    private List<String> dietaryTags;

    private Integer preparationTimeMinutes;

    private Integer calories;

    @Column(columnDefinition = "VARCHAR(20)")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String spiceLevel;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    private Integer reviewCount;

    @CreationTimestamp
    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public enum MenuCategory {
        APPETIZER, MAIN_COURSE, DESSERT, BEVERAGE, SALAD, SOUP, SIDE_DISH, BREAKFAST, LUNCH, DINNER, SNACK
    }
} 