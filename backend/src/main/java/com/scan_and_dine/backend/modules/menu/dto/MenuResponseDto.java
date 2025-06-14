package com.scan_and_dine.backend.modules.menu.dto;

import com.scan_and_dine.backend.modules.menu.entity.Menu;
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
public class MenuResponseDto {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private Menu.MenuCategory category;
    private String imageUrl;
    private Boolean isAvailable;
    private Boolean isFeatured;
    private List<String> ingredients;
    private List<String> allergens;
    private List<String> dietaryTags;
    private Integer preparationTimeMinutes;
    private Integer calories;
    private String spiceLevel;
    private BigDecimal rating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 