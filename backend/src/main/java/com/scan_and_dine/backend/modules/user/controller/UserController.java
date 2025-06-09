package com.scan_and_dine.backend.modules.user.controller;

import com.scan_and_dine.backend.modules.user.dto.CreateUserRequestDto;
import com.scan_and_dine.backend.modules.user.dto.UpdateUserRequestDto;
import com.scan_and_dine.backend.modules.user.dto.UserResponseDto;
import com.scan_and_dine.backend.modules.user.entity.User;
import com.scan_and_dine.backend.modules.user.service.UserService;
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

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping(value = {"", "/"})
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody CreateUserRequestDto requestDto) {
        log.info("Creating new user with username: {}", requestDto.getUsername());
        UserResponseDto user = userService.createUser(requestDto);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @GetMapping(value = {"", "/"})
    public ResponseEntity<Page<UserResponseDto>> getAllUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) User.UserRole role,
            @RequestParam(required = false) User.UserStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.info("Fetching users with filters and pagination: page={}, size={}, sortBy={}, sortDir={}", 
                page, size, sortBy, sortDir);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserResponseDto> users = userService.getAllUsers(
                username, email, role, status, pageable);
        
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable UUID id) {
        log.info("Fetching user by ID: {}", id);
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponseDto> getUserByUsername(@PathVariable String username) {
        log.info("Fetching user by username: {}", username);
        UserResponseDto user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponseDto> getUserByEmail(@PathVariable String email) {
        log.info("Fetching user by email: {}", email);
        UserResponseDto user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<Page<UserResponseDto>> getUsersByRole(
            @PathVariable User.UserRole role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        log.info("Fetching users by role: {}", role);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<UserResponseDto> users = userService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<UserResponseDto>> getUsersByStatus(
            @PathVariable User.UserStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        log.info("Fetching users by status: {}", status);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<UserResponseDto> users = userService.getUsersByStatus(status, pageable);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable UUID id, 
            @Valid @RequestBody UpdateUserRequestDto requestDto) {
        log.info("Updating user with ID: {}", id);
        UserResponseDto user = userService.updateUser(id, requestDto);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponseDto> updateUserStatus(
            @PathVariable UUID id, 
            @RequestBody Map<String, String> statusUpdate) {
        log.info("Updating user status for ID: {}", id);
        
        User.UserStatus status = User.UserStatus.valueOf(statusUpdate.get("status"));
        UserResponseDto user = userService.updateUserStatus(id, status);
        
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        log.info("Deleting user with ID: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
