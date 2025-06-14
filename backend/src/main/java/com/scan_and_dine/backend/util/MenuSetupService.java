package com.scan_and_dine.backend.util;

import com.scan_and_dine.backend.modules.menu.entity.Menu;
import com.scan_and_dine.backend.modules.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Order(3)
public class MenuSetupService implements CommandLineRunner {

    private final MenuRepository menuRepository;

    @Override
    public void run(String... args) {
        createSampleMenuItemsIfNotExists();
    }

    private void createSampleMenuItemsIfNotExists() {
        if (menuRepository.count() > 0) {
            log.info("Sample menu items already exist, skipping creation");
            return;
        }

        log.info("Creating sample menu items...");

        List<Menu> sampleMenuItems = Arrays.asList(
            // Appetizers
            createMenuItem("Caesar Salad", "Fresh romaine lettuce with parmesan cheese, croutons and caesar dressing", 
                    new BigDecimal("12.99"), Menu.MenuCategory.APPETIZER, 
                    "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
                    Arrays.asList("Romaine Lettuce", "Parmesan Cheese", "Croutons", "Caesar Dressing"),
                    Arrays.asList("Gluten", "Dairy"), Arrays.asList("Vegetarian"), 10, 250, null, true, false),
            
            createMenuItem("Buffalo Wings", "Crispy chicken wings tossed in spicy buffalo sauce served with celery and blue cheese", 
                    new BigDecimal("15.99"), Menu.MenuCategory.APPETIZER, 
                    "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400",
                    Arrays.asList("Chicken Wings", "Buffalo Sauce", "Celery", "Blue Cheese Dressing"),
                    Arrays.asList("Dairy"), Arrays.asList(), 15, 480, "Medium", true, true),

            // Main Courses
            createMenuItem("Grilled Salmon", "Atlantic salmon grilled to perfection, served with roasted vegetables and lemon butter sauce", 
                    new BigDecimal("28.99"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
                    Arrays.asList("Atlantic Salmon", "Mixed Vegetables", "Lemon", "Butter", "Herbs"),
                    Arrays.asList("Fish", "Dairy"), Arrays.asList("Gluten-Free", "High Protein"), 25, 420, null, true, true),
            
            createMenuItem("Beef Ribeye Steak", "Premium ribeye steak cooked to your preference with garlic mashed potatoes", 
                    new BigDecimal("42.99"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
                    Arrays.asList("Ribeye Steak", "Potatoes", "Garlic", "Butter", "Rosemary"),
                    Arrays.asList("Dairy"), Arrays.asList("Gluten-Free", "High Protein"), 30, 680, null, true, true),
            
            createMenuItem("Chicken Parmesan", "Breaded chicken breast topped with marinara sauce and melted mozzarella cheese", 
                    new BigDecimal("22.99"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
                    Arrays.asList("Chicken Breast", "Breadcrumbs", "Marinara Sauce", "Mozzarella Cheese", "Pasta"),
                    Arrays.asList("Gluten", "Dairy"), Arrays.asList(), 25, 550, null, true, false),

            createMenuItem("Vegetarian Pasta", "Penne pasta with seasonal vegetables in a creamy garlic sauce", 
                    new BigDecimal("18.99"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
                    Arrays.asList("Penne Pasta", "Bell Peppers", "Zucchini", "Mushrooms", "Garlic", "Cream"),
                    Arrays.asList("Gluten", "Dairy"), Arrays.asList("Vegetarian"), 20, 420, null, true, false),

            // Desserts
            createMenuItem("Chocolate Lava Cake", "Warm chocolate cake with molten center, served with vanilla ice cream", 
                    new BigDecimal("9.99"), Menu.MenuCategory.DESSERT, 
                    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
                    Arrays.asList("Chocolate", "Flour", "Butter", "Eggs", "Vanilla Ice Cream"),
                    Arrays.asList("Gluten", "Dairy", "Eggs"), Arrays.asList("Vegetarian"), 15, 450, null, true, true),
            
            createMenuItem("Tiramisu", "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream", 
                    new BigDecimal("8.99"), Menu.MenuCategory.DESSERT, 
                    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
                    Arrays.asList("Ladyfingers", "Coffee", "Mascarpone", "Cocoa Powder", "Eggs"),
                    Arrays.asList("Gluten", "Dairy", "Eggs"), Arrays.asList("Vegetarian"), 10, 380, null, true, false),

            // Beverages
            createMenuItem("Fresh Orange Juice", "Freshly squeezed orange juice", 
                    new BigDecimal("4.99"), Menu.MenuCategory.BEVERAGE, 
                    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
                    Arrays.asList("Fresh Oranges"), Arrays.asList(), Arrays.asList("Vegan", "Gluten-Free"), 5, 110, null, true, false),
            
            createMenuItem("Craft Beer IPA", "Hoppy India Pale Ale with citrus notes", 
                    new BigDecimal("6.99"), Menu.MenuCategory.BEVERAGE, 
                    "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400",
                    Arrays.asList("Hops", "Malt", "Yeast", "Water"), Arrays.asList("Gluten"), Arrays.asList(), 2, 180, null, true, false),

            createMenuItem("Espresso", "Rich and bold espresso shot", 
                    new BigDecimal("3.99"), Menu.MenuCategory.BEVERAGE, 
                    "https://images.unsplash.com/photo-1510707577719-ae7c14805e76?w=400",
                    Arrays.asList("Coffee Beans"), Arrays.asList(), Arrays.asList("Vegan", "Gluten-Free"), 3, 5, null, true, false),

            // Soups
            createMenuItem("Tomato Basil Soup", "Creamy tomato soup with fresh basil and herbs", 
                    new BigDecimal("7.99"), Menu.MenuCategory.SOUP, 
                    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
                    Arrays.asList("Tomatoes", "Basil", "Cream", "Onions", "Garlic"),
                    Arrays.asList("Dairy"), Arrays.asList("Vegetarian", "Gluten-Free"), 15, 180, null, true, false),

            createMenuItem("Chicken Noodle Soup", "Classic comfort soup with tender chicken and vegetables", 
                    new BigDecimal("8.99"), Menu.MenuCategory.SOUP, 
                    "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
                    Arrays.asList("Chicken", "Egg Noodles", "Carrots", "Celery", "Onions"),
                    Arrays.asList("Gluten", "Eggs"), Arrays.asList(), 20, 220, null, true, false),

            // Side Dishes
            createMenuItem("Garlic Bread", "Toasted bread with garlic butter and herbs", 
                    new BigDecimal("5.99"), Menu.MenuCategory.SIDE_DISH, 
                    "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400",
                    Arrays.asList("Bread", "Garlic", "Butter", "Parsley"),
                    Arrays.asList("Gluten", "Dairy"), Arrays.asList("Vegetarian"), 8, 180, null, true, false),

            createMenuItem("Sweet Potato Fries", "Crispy sweet potato fries with sea salt", 
                    new BigDecimal("6.99"), Menu.MenuCategory.SIDE_DISH, 
                    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
                    Arrays.asList("Sweet Potatoes", "Sea Salt", "Oil"),
                    Arrays.asList(), Arrays.asList("Vegan", "Gluten-Free"), 12, 160, null, true, false)
        );

        menuRepository.saveAll(sampleMenuItems);
        log.info("Created {} sample menu items successfully", sampleMenuItems.size());
    }

    private Menu createMenuItem(String name, String description, BigDecimal price, 
                               Menu.MenuCategory category, String imageUrl,
                               List<String> ingredients, List<String> allergens, 
                               List<String> dietaryTags, Integer prepTime, Integer calories, 
                               String spiceLevel, Boolean isAvailable, Boolean isFeatured) {
        Menu menu = new Menu();
        menu.setName(name);
        menu.setDescription(description);
        menu.setPrice(price);
        menu.setCategory(category);
        menu.setImageUrl(imageUrl);
        menu.setIngredients(ingredients);
        menu.setAllergens(allergens);
        menu.setDietaryTags(dietaryTags);
        menu.setPreparationTimeMinutes(prepTime);
        menu.setCalories(calories);
        menu.setSpiceLevel(spiceLevel);
        menu.setIsAvailable(isAvailable);
        menu.setIsFeatured(isFeatured);
        menu.setRating(BigDecimal.valueOf(4.0 + Math.random()));
        menu.setReviewCount((int) (Math.random() * 100) + 10);
        return menu;
    }
} 