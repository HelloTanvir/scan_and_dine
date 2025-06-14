package com.scan_and_dine.backend.modules.menu.dto;

import com.scan_and_dine.backend.modules.menu.entity.Menu;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMenuRequestDto {
    @Size(max = 100, message = "Menu item name cannot exceed 100 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private Menu.MenuCategory category;

    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    private String imageUrl;

    private Boolean isAvailable;

    private Boolean isFeatured;

    private List<String> ingredients;

    private List<String> allergens;

    private List<String> dietaryTags;

    @Positive(message = "Preparation time must be positive")
    private Integer preparationTimeMinutes;

    @Positive(message = "Calories must be positive")
    private Integer calories;

    @Size(max = 20, message = "Spice level cannot exceed 20 characters")
    private String spiceLevel;
} 