package com.scan_and_dine.backend.modules.menu.mapper;

import com.scan_and_dine.backend.modules.menu.dto.CreateMenuRequestDto;
import com.scan_and_dine.backend.modules.menu.dto.MenuResponseDto;
import com.scan_and_dine.backend.modules.menu.dto.UpdateMenuRequestDto;
import com.scan_and_dine.backend.modules.menu.entity.Menu;
import org.mapstruct.*;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface MenuMapper {

    MenuResponseDto toResponseDto(Menu menu);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "reviewCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Menu toEntity(CreateMenuRequestDto requestDto);

    @AfterMapping
    default void setDefaults(@MappingTarget Menu menu, CreateMenuRequestDto requestDto) {
        if (menu.getIsAvailable() == null) {
            menu.setIsAvailable(true);
        }
        if (menu.getIsFeatured() == null) {
            menu.setIsFeatured(false);
        }
        menu.setRating(BigDecimal.ZERO);
        menu.setReviewCount(0);
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "reviewCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateMenuRequestDto requestDto, @MappingTarget Menu menu);
} 