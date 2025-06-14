package com.scan_and_dine.backend.modules.menu.controller;

import com.scan_and_dine.backend.modules.menu.dto.CreateMenuRequestDto;
import com.scan_and_dine.backend.modules.menu.dto.MenuResponseDto;
import com.scan_and_dine.backend.modules.menu.dto.UpdateMenuRequestDto;
import com.scan_and_dine.backend.modules.menu.entity.Menu;
import com.scan_and_dine.backend.modules.menu.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
@Slf4j
public class MenuController {

    private final MenuService menuService;

    @PostMapping(value = {"", "/"})
    public ResponseEntity<MenuResponseDto> createMenuItem(@Valid @RequestBody CreateMenuRequestDto requestDto) {
        log.info("Creating new menu item with name: {}", requestDto.getName());
        MenuResponseDto menuItem = menuService.createMenuItem(requestDto);
        return new ResponseEntity<>(menuItem, HttpStatus.CREATED);
    }

    @GetMapping(value = {"", "/"})
    public ResponseEntity<Page<MenuResponseDto>> getAllMenuItems(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Menu.MenuCategory category,
            @RequestParam(required = false) Boolean isAvailable,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.info("Fetching menu items with filters and pagination: page={}, size={}, sortBy={}, sortDir={}", 
                page, size, sortBy, sortDir);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<MenuResponseDto> menuItems = menuService.getAllMenuItems(
                name, category, isAvailable, isFeatured, minPrice, maxPrice, pageable);
        
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuResponseDto> getMenuItemById(@PathVariable UUID id) {
        log.info("Fetching menu item by ID: {}", id);
        MenuResponseDto menuItem = menuService.getMenuItemById(id);
        return ResponseEntity.ok(menuItem);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<MenuResponseDto> getMenuItemByName(@PathVariable String name) {
        log.info("Fetching menu item by name: {}", name);
        MenuResponseDto menuItem = menuService.getMenuItemByName(name);
        return ResponseEntity.ok(menuItem);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuResponseDto>> getMenuItemsByCategory(@PathVariable Menu.MenuCategory category) {
        log.info("Fetching menu items by category: {}", category);
        List<MenuResponseDto> menuItems = menuService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/available")
    public ResponseEntity<List<MenuResponseDto>> getAvailableMenuItems() {
        log.info("Fetching available menu items");
        List<MenuResponseDto> menuItems = menuService.getAvailableMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<MenuResponseDto>> getFeaturedMenuItems() {
        log.info("Fetching featured menu items");
        List<MenuResponseDto> menuItems = menuService.getFeaturedMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MenuResponseDto>> searchMenuItems(@RequestParam String query) {
        log.info("Searching menu items with query: {}", query);
        List<MenuResponseDto> menuItems = menuService.searchMenuItems(query);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<MenuResponseDto>> getMenuItemsByPriceRange(
            @RequestParam BigDecimal minPrice, 
            @RequestParam BigDecimal maxPrice) {
        log.info("Fetching menu items with price range: {} - {}", minPrice, maxPrice);
        List<MenuResponseDto> menuItems = menuService.getMenuItemsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(menuItems);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuResponseDto> updateMenuItem(
            @PathVariable UUID id, 
            @Valid @RequestBody UpdateMenuRequestDto requestDto) {
        log.info("Updating menu item with ID: {}", id);
        MenuResponseDto menuItem = menuService.updateMenuItem(id, requestDto);
        return ResponseEntity.ok(menuItem);
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<MenuResponseDto> updateMenuItemAvailability(
            @PathVariable UUID id, 
            @RequestBody Map<String, Boolean> availabilityUpdate) {
        log.info("Updating menu item availability for ID: {}", id);
        
        Boolean isAvailable = availabilityUpdate.get("isAvailable");
        MenuResponseDto menuItem = menuService.updateMenuItemAvailability(id, isAvailable);
        
        return ResponseEntity.ok(menuItem);
    }

    @PatchMapping("/{id}/featured")
    public ResponseEntity<MenuResponseDto> updateMenuItemFeaturedStatus(
            @PathVariable UUID id, 
            @RequestBody Map<String, Boolean> featuredUpdate) {
        log.info("Updating menu item featured status for ID: {}", id);
        
        Boolean isFeatured = featuredUpdate.get("isFeatured");
        MenuResponseDto menuItem = menuService.updateMenuItemFeaturedStatus(id, isFeatured);
        
        return ResponseEntity.ok(menuItem);
    }

    @PatchMapping("/bulk-availability")
    public ResponseEntity<List<MenuResponseDto>> bulkUpdateAvailability(
            @RequestBody Map<String, Object> bulkUpdate) {
        log.info("Bulk updating menu item availability");
        
        @SuppressWarnings("unchecked")
        List<UUID> menuIds = (List<UUID>) bulkUpdate.get("menuIds");
        Boolean isAvailable = (Boolean) bulkUpdate.get("isAvailable");
        
        List<MenuResponseDto> menuItems = menuService.bulkUpdateAvailability(menuIds, isAvailable);
        
        return ResponseEntity.ok(menuItems);
    }

    @PatchMapping("/bulk-featured")
    public ResponseEntity<List<MenuResponseDto>> bulkUpdateFeaturedStatus(
            @RequestBody Map<String, Object> bulkUpdate) {
        log.info("Bulk updating menu item featured status");
        
        @SuppressWarnings("unchecked")
        List<UUID> menuIds = (List<UUID>) bulkUpdate.get("menuIds");
        Boolean isFeatured = (Boolean) bulkUpdate.get("isFeatured");
        
        List<MenuResponseDto> menuItems = menuService.bulkUpdateFeaturedStatus(menuIds, isFeatured);
        
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getMenuStatistics() {
        log.info("Fetching menu statistics");
        Map<String, Object> statistics = menuService.getMenuStatistics();
        return ResponseEntity.ok(statistics);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable UUID id) {
        log.info("Deleting menu item with ID: {}", id);
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
} 