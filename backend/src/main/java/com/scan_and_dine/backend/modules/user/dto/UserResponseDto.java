package com.scan_and_dine.backend.modules.user.dto;

import com.scan_and_dine.backend.modules.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private UUID id;
    private String username;
    private String email;
    private String phoneNumber;
    private User.UserRole role;
    private User.UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 