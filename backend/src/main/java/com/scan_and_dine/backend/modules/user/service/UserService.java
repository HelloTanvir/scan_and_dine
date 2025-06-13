package com.scan_and_dine.backend.modules.user.service;

import com.scan_and_dine.backend.config.PasswordConfig;
import com.scan_and_dine.backend.exception.DuplicateResourceException;
import com.scan_and_dine.backend.exception.ResourceNotFoundException;
import com.scan_and_dine.backend.modules.user.dto.CreateUserRequestDto;
import com.scan_and_dine.backend.modules.user.dto.UpdateUserRequestDto;
import com.scan_and_dine.backend.modules.user.dto.UserResponseDto;
import com.scan_and_dine.backend.modules.user.entity.User;
import com.scan_and_dine.backend.modules.user.mapper.UserMapper;
import com.scan_and_dine.backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordConfig passwordConfig;

    public UserResponseDto createUser(CreateUserRequestDto requestDto) {
        log.info("Creating user with username: {}", requestDto.getUsername());
        
        validateUniqueConstraints(requestDto.getUsername(), requestDto.getEmail());
        
        User user = userMapper.toEntity(requestDto);
        user.setPassword(passwordConfig.hashPassword(requestDto.getPassword()));
        User savedUser = userRepository.save(user);
        
        log.info("User created successfully with ID: {}", savedUser.getId());
        return userMapper.toResponseDto(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserById(UUID id) {
        return findUserAndConvert(() -> userRepository.findById(id), 
                "User not found with ID: " + id);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserByUsername(String username) {
        return findUserAndConvert(() -> userRepository.findByUsername(username), 
                "User not found with username: " + username);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        return findUserAndConvert(() -> userRepository.findByEmail(email), 
                "User not found with email: " + email);
    }

    @Transactional(readOnly = true)
    public Page<UserResponseDto> getAllUsers(String username, String email, User.UserRole role,
                                           User.UserStatus status, Pageable pageable) {
        log.info("Fetching users with filters and pagination");
        return findUsersWithFilters(username, email, role, status, pageable);
    }

    @Transactional(readOnly = true)
    public Page<UserResponseDto> getUsersByRole(User.UserRole role, Pageable pageable) {
        log.info("Fetching users with role: {}", role);
        return findUsersWithFilters(null, null, role, null, pageable);
    }

    @Transactional(readOnly = true)
    public Page<UserResponseDto> getUsersByStatus(User.UserStatus status, Pageable pageable) {
        log.info("Fetching users with status: {}", status);
        return findUsersWithFilters(null, null, null, status, pageable);
    }

    private Page<UserResponseDto> findUsersWithFilters(String username, String email, User.UserRole role,
                                                      User.UserStatus status, Pageable pageable) {
        String roleStr = role != null ? role.name() : null;
        String statusStr = status != null ? status.name() : null;
        return userRepository.findUsersWithFilters(username, email, roleStr, statusStr, pageable)
                .map(userMapper::toResponseDto);
    }

    public UserResponseDto updateUser(UUID id, UpdateUserRequestDto requestDto) {
        log.info("Updating user with ID: {}", id);
        
        User existingUser = findUserById(id);
        validateUpdateConstraints(existingUser, requestDto);
        
        userMapper.updateEntityFromDto(requestDto, existingUser);
        User updatedUser = userRepository.save(existingUser);
        
        log.info("User updated successfully with ID: {}", updatedUser.getId());
        return userMapper.toResponseDto(updatedUser);
    }

    public UserResponseDto updateUserStatus(UUID id, User.UserStatus status) {
        log.info("Updating user status with ID: {} to status: {}", id, status);
        
        User user = findUserById(id);
        user.setStatus(status);
        User updatedUser = userRepository.save(user);
        
        log.info("User status updated successfully");
        return userMapper.toResponseDto(updatedUser);
    }

    public void deleteUser(UUID id) {
        log.info("Deleting user with ID: {}", id);
        
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        
        userRepository.deleteById(id);
        log.info("User deleted successfully with ID: {}", id);
    }

    private UserResponseDto findUserAndConvert(Supplier<java.util.Optional<User>> finder, String errorMessage) {
        User user = finder.get()
                .orElseThrow(() -> new ResourceNotFoundException(errorMessage));
        return userMapper.toResponseDto(user);
    }

    private User findUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    private void validateUniqueConstraints(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("Username already exists: " + username);
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already exists: " + email);
        }
    }

    private void validateUpdateConstraints(User existingUser, UpdateUserRequestDto requestDto) {
        if (requestDto.getUsername() != null && 
            !requestDto.getUsername().equals(existingUser.getUsername()) &&
            userRepository.existsByUsername(requestDto.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + requestDto.getUsername());
        }
        
        if (requestDto.getEmail() != null && 
            !requestDto.getEmail().equals(existingUser.getEmail()) &&
            userRepository.existsByEmail(requestDto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + requestDto.getEmail());
        }
    }
} 