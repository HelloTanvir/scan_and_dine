package com.scan_and_dine.backend.modules.auth.controller;

import com.scan_and_dine.backend.modules.auth.dto.LoginRequestDto;
import com.scan_and_dine.backend.modules.auth.dto.LoginResponseDto;
import com.scan_and_dine.backend.modules.auth.dto.RefreshTokenRequestDto;
import com.scan_and_dine.backend.modules.auth.dto.RefreshTokenResponseDto;
import com.scan_and_dine.backend.modules.auth.service.AuthService;
import com.scan_and_dine.backend.modules.user.dto.UserResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        log.info("Login request for email: {}", request.getEmail());
        LoginResponseDto response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponseDto> refreshToken(@Valid @RequestBody RefreshTokenRequestDto request) {
        log.info("Refresh token request");
        RefreshTokenResponseDto response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        log.info("Logout request");
        authService.logout();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser() {
        log.info("Get current user request");
        UserResponseDto user = authService.getCurrentUser();
        return ResponseEntity.ok(user);
    }
} 