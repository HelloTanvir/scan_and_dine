package com.scan_and_dine.backend.modules.user.mapper;

import com.scan_and_dine.backend.modules.user.dto.CreateUserRequestDto;
import com.scan_and_dine.backend.modules.user.dto.UpdateUserRequestDto;
import com.scan_and_dine.backend.modules.user.dto.UserResponseDto;
import com.scan_and_dine.backend.modules.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.AfterMapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDto toResponseDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    User toEntity(CreateUserRequestDto requestDto);

    @AfterMapping
    default void setDefaults(@MappingTarget User user, CreateUserRequestDto requestDto) {
        if (user.getRole() == null) {
            user.setRole(User.UserRole.CUSTOMER);
        }
        user.setStatus(User.UserStatus.ACTIVE);
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateEntityFromDto(UpdateUserRequestDto requestDto, @MappingTarget User user);
} 