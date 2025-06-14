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
        createBangladeshiMenuItemsIfNotExists();
    }

    private void createBangladeshiMenuItemsIfNotExists() {
        if (menuRepository.count() > 0) {
            log.info("Bangladeshi menu items already exist, skipping creation");
            return;
        }

        log.info("Creating authentic Bangladeshi menu items...");

        List<Menu> banglaMenuItems = Arrays.asList(
            // Main Course - Rice Dishes
            createMenuItem("Kacchi Biryani", "Authentic Dhaka-style mutton biryani where raw marinated meat and rice are layered and slow-cooked together in a sealed pot. Features tender mutton, fragrant basmati rice, potatoes, and aromatic spices including saffron and kewra water.", 
                    new BigDecimal("450.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1563379091339-03246963d29a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Basmati Rice", "Mutton", "Yogurt", "Onions", "Ghee", "Saffron", "Potatoes"),
                    Arrays.asList("Dairy"), Arrays.asList("High Protein"), 90, 680, "Medium", true, true),

            createMenuItem("Morog Polao", "Traditional Bengali chicken pilaf made with premium basmati rice, tender chicken pieces, and ghee. This rich and aromatic dish is perfect for celebrations and special occasions.", 
                    new BigDecimal("380.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Basmati Rice", "Chicken", "Onions", "Ghee", "Cardamom", "Cinnamon"),
                    Arrays.asList("Dairy"), Arrays.asList("High Protein"), 60, 520, "Mild", true, true),

            createMenuItem("Beef Tehari", "Spiced beef and rice dish from Old Dhaka tradition. Slow-cooked with potatoes, aromatic whole spices, and mustard oil. A hearty one-pot meal bursting with flavors.", 
                    new BigDecimal("420.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1571197119792-53c0c5aa5c05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Rice", "Beef", "Onions", "Potatoes", "Yogurt", "Ghee", "Whole Spices"),
                    Arrays.asList("Dairy"), Arrays.asList("High Protein"), 75, 620, "Spicy", true, true),

            createMenuItem("Bhuna Khichuri", "Rich version of traditional khichuri with rice, lentils, and seasonal vegetables slow-cooked with aromatic Bengali spices. The ultimate Bengali comfort food, especially popular during monsoon season.", 
                    new BigDecimal("180.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Rice", "Moong Dal", "Turmeric", "Ginger", "Onions", "Ghee"),
                    Arrays.asList("Dairy"), Arrays.asList("Vegetarian", "Comfort Food"), 30, 320, "Mild", true, false),

            // Fish Dishes - Bengali Specialty
            createMenuItem("Sorshe Ilish", "The crown jewel of Bengali cuisine - fresh Hilsa fish (Bangladesh's national fish) cooked in mustard seed paste with green chilies and mustard oil. A delicacy that defines Bengali culture.", 
                    new BigDecimal("650.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.istockphoto.com/photos/hilsa-fish-pictures-id1326892962?k=20&m=1326892962&s=612x612&w=0&h=vZ8rZ2JgQKJ9QRHhQ8XqMGW4VGQhFGrQJ4QKqHqGqOQ=",
                    Arrays.asList("Hilsa Fish", "Mustard Seeds", "Mustard Oil", "Green Chili", "Turmeric"),
                    Arrays.asList("Fish", "Mustard"), Arrays.asList("High Omega-3", "Traditional"), 25, 280, "Medium", true, true),

            createMenuItem("Ilish Bhaja", "Simple yet perfect - fresh Hilsa fish pieces marinated with turmeric and salt, then lightly fried in mustard oil until golden and crispy. Best enjoyed with steamed rice.", 
                    new BigDecimal("580.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.istockphoto.com/photos/fried-hilsa-fish-pictures-id1326892963?k=20&m=1326892963&s=612x612&w=0&h=1vZ8rZ2JgQKJ9QRHhQ8XqMGW4VGQhFGrQJ4QKqHqGqOQ=",
                    Arrays.asList("Hilsa Fish", "Turmeric", "Salt", "Mustard Oil"),
                    Arrays.asList("Fish"), Arrays.asList("High Omega-3", "Gluten-Free"), 15, 240, "Mild", true, true),

            createMenuItem("Chingri Malai Curry", "Luxurious prawn curry cooked in rich coconut milk with traditional Bengali spices. This creamy, aromatic dish is a celebration of coastal Bengali cuisine.", 
                    new BigDecimal("520.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1565299585323-38174c19e1f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Prawns", "Coconut Milk", "Onions", "Ginger", "Garlic", "Garam Masala"),
                    Arrays.asList("Shellfish", "Coconut"), Arrays.asList("High Protein"), 20, 380, "Medium", true, true),

            createMenuItem("Rui Macher Jhol", "Traditional Bengali fish curry with Rohu fish in a light, flavorful gravy with potatoes and tomatoes. A homestyle dish that brings comfort and nostalgia to every Bengali heart.", 
                    new BigDecimal("320.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Rohu Fish", "Potatoes", "Tomatoes", "Onions", "Turmeric", "Cumin"),
                    Arrays.asList("Fish"), Arrays.asList("High Protein", "Traditional"), 25, 250, "Medium", true, false),

            // Meat Dishes
            createMenuItem("Kala Bhuna", "Chittagong's signature dark curry - beef slow-cooked with caramelized onions until rich and intensely flavored. This deep, complex dish represents the unique cuisine of port city Chittagong.", 
                    new BigDecimal("480.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Beef", "Onions", "Ginger", "Garlic", "Cumin", "Coriander", "Cinnamon"),
                    Arrays.asList(), Arrays.asList("High Protein", "Traditional"), 120, 520, "Medium", true, true),

            createMenuItem("Mezban Beef", "Traditional Chittagong communal feast beef curry featuring tender meat in aromatic spices. Originally served at large community gatherings, this dish embodies the spirit of Bengali hospitality.", 
                    new BigDecimal("420.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Beef", "Onions", "Yogurt", "Garam Masala", "Bay Leaves", "Cardamom"),
                    Arrays.asList("Dairy"), Arrays.asList("High Protein"), 90, 480, "Medium", true, true),

            createMenuItem("Chicken Roast", "Bengali-style chicken roast with rich, luscious gravy cooked in ghee and aromatic spices. Served with potatoes and boiled eggs, this sweet-savory curry is a celebration dish.", 
                    new BigDecimal("380.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Chicken", "Potatoes", "Eggs", "Onions", "Yogurt", "Garam Masala"),
                    Arrays.asList("Dairy", "Eggs"), Arrays.asList("High Protein"), 45, 420, "Medium", true, true),

            // Vegetarian Dishes
            createMenuItem("Shukto", "Traditional Bengali mixed vegetable curry combining bitter and sweet flavors. Made with bitter gourd, sweet potato, and milk, this dish starts a traditional Bengali meal.", 
                    new BigDecimal("220.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Bitter Gourd", "Eggplant", "Sweet Potato", "Drumstick", "Milk", "Ginger"),
                    Arrays.asList("Dairy"), Arrays.asList("Vegetarian", "Traditional"), 20, 180, "Mild", true, false),

            createMenuItem("Aloo Posto", "Creamy potato curry with poppy seed paste - the ultimate Bengali comfort food. This mild, nutty dish showcases the subtle use of poppy seeds in Bengali cuisine.", 
                    new BigDecimal("180.00"), Menu.MenuCategory.MAIN_COURSE, 
                    "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Potatoes", "Poppy Seeds", "Green Chili", "Mustard Oil", "Onions"),
                    Arrays.asList("Seeds"), Arrays.asList("Vegetarian", "Gluten-Free"), 15, 220, "Mild", true, false),

            // Dal & Lentils
            createMenuItem("Masoor Dal", "Red lentil curry tempered with onions, garlic, and traditional Bengali five-spice. A staple protein source in Bengali households, simple yet deeply satisfying.", 
                    new BigDecimal("120.00"), Menu.MenuCategory.SOUP, 
                    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Red Lentils", "Onions", "Garlic", "Turmeric", "Cumin", "Coriander"),
                    Arrays.asList(), Arrays.asList("Vegetarian", "High Protein", "Gluten-Free"), 20, 150, "Mild", true, false),

            createMenuItem("Cholar Dal", "Sweet Bengal gram curry with coconut and raisins, often served during pujas and special occasions. This mildly sweet dal pairs perfectly with luchi or rice.", 
                    new BigDecimal("140.00"), Menu.MenuCategory.SOUP, 
                    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Bengal Gram", "Coconut", "Raisins", "Bay Leaves", "Cinnamon", "Ghee"),
                    Arrays.asList("Nuts", "Dairy"), Arrays.asList("Vegetarian"), 25, 180, "Mild", true, false),

            // Appetizers & Street Food
            createMenuItem("Fuchka", "Bangladesh's beloved street snack - crispy puris filled with spicy tamarind water, chickpeas, and chutneys. Each bite explodes with tangy, spicy flavors.", 
                    new BigDecimal("80.00"), Menu.MenuCategory.APPETIZER, 
                    "https://images.unsplash.com/photo-1606471191009-c2aa0b9caab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Puri", "Chickpeas", "Tamarind", "Mint", "Coriander", "Chili"),
                    Arrays.asList("Gluten"), Arrays.asList("Vegan", "Street Food"), 5, 120, "Spicy", true, false),

            createMenuItem("Singara", "Triangular deep-fried pastry with spiced potato filling. A popular tea-time snack that's crispy outside and flavorful inside.", 
                    new BigDecimal("60.00"), Menu.MenuCategory.APPETIZER, 
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Flour", "Potatoes", "Onions", "Cumin", "Coriander", "Green Chili"),
                    Arrays.asList("Gluten"), Arrays.asList("Vegetarian"), 8, 180, "Medium", true, false),

            createMenuItem("Chotpoti", "Popular Dhaka street food combining chickpeas, potatoes, eggs, and tangy tamarind sauce. This chatpata snack is a flavor explosion in every bite.", 
                    new BigDecimal("100.00"), Menu.MenuCategory.APPETIZER, 
                    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Chickpeas", "Potatoes", "Eggs", "Tamarind", "Onions", "Cilantro"),
                    Arrays.asList("Eggs"), Arrays.asList("Street Food"), 10, 220, "Tangy", true, false),

            // Desserts
            createMenuItem("Roshogolla", "The king of Bengali sweets - spongy cottage cheese balls soaked in sugar syrup. This iconic dessert represents the pinnacle of Bengali confectionery artistry.", 
                    new BigDecimal("120.00"), Menu.MenuCategory.DESSERT, 
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Chenna", "Sugar", "Cardamom", "Rose Water"),
                    Arrays.asList("Dairy"), Arrays.asList("Vegetarian", "Traditional"), 5, 180, null, true, true),

            createMenuItem("Mishti Doi", "Sweet yogurt dessert served in traditional earthen pots. The gradual evaporation through porous clay creates the perfect thick, creamy texture that Bogra is famous for.", 
                    new BigDecimal("80.00"), Menu.MenuCategory.DESSERT, 
                    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Milk", "Sugar", "Yogurt Culture"),
                    Arrays.asList("Dairy"), Arrays.asList("Vegetarian", "Probiotic"), 10, 140, null, true, false),

            createMenuItem("Sandesh", "Delicate milk-based sweet with subtle cardamom flavor. This melt-in-mouth confection showcases the refinement of Bengali sweet-making traditions.", 
                    new BigDecimal("100.00"), Menu.MenuCategory.DESSERT, 
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Milk", "Sugar", "Cardamom"),
                    Arrays.asList("Dairy"), Arrays.asList("Vegetarian"), 8, 160, null, true, true),

            createMenuItem("Kheer", "Traditional rice pudding slow-cooked with milk, cardamom, and nuts. This creamy dessert is often prepared for festivals and special celebrations.", 
                    new BigDecimal("90.00"), Menu.MenuCategory.DESSERT, 
                    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Rice", "Milk", "Sugar", "Cardamom", "Almonds", "Pistachios"),
                    Arrays.asList("Dairy", "Nuts"), Arrays.asList("Vegetarian"), 15, 200, null, true, false),

            // Beverages
            createMenuItem("Borhani", "Traditional spiced yogurt drink with mint and black salt. Perfect digestive aid served with biryani and rich meals at weddings and celebrations.", 
                    new BigDecimal("60.00"), Menu.MenuCategory.BEVERAGE, 
                    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Yogurt", "Mint", "Black Salt", "Cumin", "Ginger"),
                    Arrays.asList("Dairy"), Arrays.asList("Probiotic", "Digestive"), 5, 80, "Tangy", true, false),

            createMenuItem("Cha", "Traditional Bengali tea with milk, sugar, and cardamom. The lifeblood of Bengali culture, this sweet, milky tea brings people together throughout the day.", 
                    new BigDecimal("30.00"), Menu.MenuCategory.BEVERAGE, 
                    "https://images.unsplash.com/photo-1564890769567-c3dd4ba5fe24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Tea Leaves", "Milk", "Sugar", "Cardamom"),
                    Arrays.asList("Dairy"), Arrays.asList("Traditional"), 5, 60, null, true, false),

            createMenuItem("Lachhi", "Refreshing yogurt-based drink with rose water and sugar. This cooling beverage is perfect for hot weather and pairs beautifully with spicy foods.", 
                    new BigDecimal("50.00"), Menu.MenuCategory.BEVERAGE, 
                    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Yogurt", "Sugar", "Rose Water", "Cardamom"),
                    Arrays.asList("Dairy"), Arrays.asList("Probiotic", "Refreshing"), 3, 90, null, true, false),

            createMenuItem("Akher Rosh", "Fresh sugarcane juice with ginger and mint. This natural energy drink provides instant refreshment and is a favorite during summer months.", 
                    new BigDecimal("40.00"), Menu.MenuCategory.BEVERAGE, 
                    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    Arrays.asList("Fresh Sugarcane", "Ginger", "Mint", "Lemon"),
                    Arrays.asList(), Arrays.asList("Vegan", "Natural Energy"), 2, 110, null, true, false)
        );

        menuRepository.saveAll(banglaMenuItems);
        log.info("Successfully created {} authentic Bangladeshi menu items", banglaMenuItems.size());
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