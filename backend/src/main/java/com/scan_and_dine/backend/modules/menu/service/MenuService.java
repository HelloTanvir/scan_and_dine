package com.scan_and_dine.backend.modules.menu.service;

import com.scan_and_dine.backend.exception.DuplicateResourceException;
import com.scan_and_dine.backend.exception.ResourceNotFoundException;
import com.scan_and_dine.backend.modules.menu.dto.CreateMenuRequestDto;
import com.scan_and_dine.backend.modules.menu.dto.MenuResponseDto;
import com.scan_and_dine.backend.modules.menu.dto.UpdateMenuRequestDto;
import com.scan_and_dine.backend.modules.menu.entity.Menu;
import com.scan_and_dine.backend.modules.menu.mapper.MenuMapper;
import com.scan_and_dine.backend.modules.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MenuService {

    private final MenuRepository menuRepository;
    private final MenuMapper menuMapper;

    public MenuResponseDto createMenuItem(CreateMenuRequestDto requestDto) {
        log.info("Creating menu item with name: {}", requestDto.getName());
        
        if (menuRepository.existsByName(requestDto.getName())) {
            throw new DuplicateResourceException("Menu item name already exists: " + requestDto.getName());
        }
        
        Menu menu = menuMapper.toEntity(requestDto);
        Menu savedMenu = menuRepository.save(menu);
        
        log.info("Menu item created successfully with ID: {}", savedMenu.getId());
        return menuMapper.toResponseDto(savedMenu);
    }

    @Transactional(readOnly = true)
    public MenuResponseDto getMenuItemById(UUID id) {
        log.info("Fetching menu item by ID: {}", id);
        Menu menu = findMenuItemById(id);
        return menuMapper.toResponseDto(menu);
    }

    @Transactional(readOnly = true)
    public MenuResponseDto getMenuItemByName(String name) {
        log.info("Fetching menu item by name: {}", name);
        Menu menu = menuRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with name: " + name));
        return menuMapper.toResponseDto(menu);
    }

    @Transactional(readOnly = true)
    public Page<MenuResponseDto> getAllMenuItems(String name, Menu.MenuCategory category,
                                               Boolean isAvailable, Boolean isFeatured,
                                               BigDecimal minPrice, BigDecimal maxPrice,
                                               Pageable pageable) {
        log.info("Fetching menu items with filters and pagination");
        String categoryStr = category != null ? category.name() : null;
        return menuRepository.findMenuItemsWithFilters(name, categoryStr, isAvailable, 
                isFeatured, minPrice, maxPrice, pageable)
                .map(menuMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public List<MenuResponseDto> getMenuItemsByCategory(Menu.MenuCategory category) {
        log.info("Fetching menu items with category: {}", category);
        return menuRepository.findByCategory(category)
                .stream()
                .map(menuMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MenuResponseDto> getAvailableMenuItems() {
        log.info("Fetching available menu items");
        return menuRepository.findByIsAvailable(true)
                .stream()
                .map(menuMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MenuResponseDto> getFeaturedMenuItems() {
        log.info("Fetching featured menu items");
        return menuRepository.findFeaturedMenuItems()
                .stream()
                .map(menuMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MenuResponseDto> searchMenuItems(String query) {
        log.info("Searching menu items with query: {}", query);
        return menuRepository.searchMenuItems(query)
                .stream()
                .map(menuMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MenuResponseDto> getMenuItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        log.info("Fetching menu items with price range: {} - {}", minPrice, maxPrice);
        return menuRepository.findByPriceRange(minPrice, maxPrice)
                .stream()
                .map(menuMapper::toResponseDto)
                .toList();
    }

    public MenuResponseDto updateMenuItem(UUID id, UpdateMenuRequestDto requestDto) {
        log.info("Updating menu item with ID: {}", id);
        
        Menu existingMenu = findMenuItemById(id);
        
        // Check for duplicate name if updating
        if (requestDto.getName() != null && 
            !requestDto.getName().equals(existingMenu.getName()) &&
            menuRepository.existsByName(requestDto.getName())) {
            throw new DuplicateResourceException("Menu item name already exists: " + requestDto.getName());
        }
        
        menuMapper.updateEntityFromDto(requestDto, existingMenu);
        Menu updatedMenu = menuRepository.save(existingMenu);
        
        log.info("Menu item updated successfully with ID: {}", updatedMenu.getId());
        return menuMapper.toResponseDto(updatedMenu);
    }

    public MenuResponseDto updateMenuItemAvailability(UUID id, Boolean isAvailable) {
        log.info("Updating menu item availability with ID: {} to: {}", id, isAvailable);
        
        Menu menu = findMenuItemById(id);
        menu.setIsAvailable(isAvailable);
        
        Menu updatedMenu = menuRepository.save(menu);
        log.info("Menu item availability updated successfully");
        return menuMapper.toResponseDto(updatedMenu);
    }

    public MenuResponseDto updateMenuItemFeaturedStatus(UUID id, Boolean isFeatured) {
        log.info("Updating menu item featured status with ID: {} to: {}", id, isFeatured);
        
        Menu menu = findMenuItemById(id);
        menu.setIsFeatured(isFeatured);
        
        Menu updatedMenu = menuRepository.save(menu);
        log.info("Menu item featured status updated successfully");
        return menuMapper.toResponseDto(updatedMenu);
    }

    public List<MenuResponseDto> bulkUpdateAvailability(List<UUID> menuIds, Boolean isAvailable) {
        log.info("Bulk updating availability for {} menu items to: {}", menuIds.size(), isAvailable);
        
        List<Menu> menuItems = menuRepository.findAllById(menuIds);
        if (menuItems.size() != menuIds.size()) {
            throw new ResourceNotFoundException("Some menu items not found");
        }
        
        menuItems.forEach(menu -> menu.setIsAvailable(isAvailable));
        
        List<Menu> updatedMenuItems = menuRepository.saveAll(menuItems);
        log.info("Bulk availability update completed successfully");
        
        return updatedMenuItems.stream()
                .map(menuMapper::toResponseDto)
                .toList();
    }

    public List<MenuResponseDto> bulkUpdateFeaturedStatus(List<UUID> menuIds, Boolean isFeatured) {
        log.info("Bulk updating featured status for {} menu items to: {}", menuIds.size(), isFeatured);
        
        List<Menu> menuItems = menuRepository.findAllById(menuIds);
        if (menuItems.size() != menuIds.size()) {
            throw new ResourceNotFoundException("Some menu items not found");
        }
        
        menuItems.forEach(menu -> menu.setIsFeatured(isFeatured));
        
        List<Menu> updatedMenuItems = menuRepository.saveAll(menuItems);
        log.info("Bulk featured status update completed successfully");
        
        return updatedMenuItems.stream()
                .map(menuMapper::toResponseDto)
                .toList();
    }

    public Map<String, Object> getMenuStatistics() {
        log.info("Fetching menu statistics");
        
        long totalItems = menuRepository.countTotalMenuItems();
        long availableItems = menuRepository.countAvailableMenuItems();
        long featuredItems = menuRepository.countFeaturedMenuItems();
        BigDecimal averagePrice = menuRepository.findAveragePrice();
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("total", totalItems);
        statistics.put("available", availableItems);
        statistics.put("featured", featuredItems);
        statistics.put("unavailable", totalItems - availableItems);
        statistics.put("averagePrice", averagePrice != null ? averagePrice : BigDecimal.ZERO);
        
        // Category breakdown
        List<Object[]> categoryStats = menuRepository.getMenuItemCountByCategory();
        Map<String, Long> categoryBreakdown = new HashMap<>();
        for (Object[] stat : categoryStats) {
            categoryBreakdown.put(stat[0].toString(), ((Number) stat[1]).longValue());
        }
        statistics.put("categoryBreakdown", categoryBreakdown);
        
        return statistics;
    }

    public void deleteMenuItem(UUID id) {
        log.info("Deleting menu item with ID: {}", id);
        
        Menu menu = findMenuItemById(id);
        menuRepository.deleteById(id);
        log.info("Menu item deleted successfully with ID: {}", id);
    }

    private Menu findMenuItemById(UUID id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with ID: " + id));
    }
} 