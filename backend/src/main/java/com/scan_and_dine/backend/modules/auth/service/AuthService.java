package com.scan_and_dine.backend.modules.auth.service;

import com.scan_and_dine.backend.config.JwtConfig;
import com.scan_and_dine.backend.exception.ResourceNotFoundException;
import com.scan_and_dine.backend.modules.auth.dto.LoginRequestDto;
import com.scan_and_dine.backend.modules.auth.dto.LoginResponseDto;
import com.scan_and_dine.backend.modules.auth.dto.RefreshTokenRequestDto;
import com.scan_and_dine.backend.modules.auth.dto.RefreshTokenResponseDto;
import com.scan_and_dine.backend.modules.auth.entity.RefreshToken;
import com.scan_and_dine.backend.modules.auth.repository.RefreshTokenRepository;
import com.scan_and_dine.backend.modules.user.dto.UserResponseDto;
import com.scan_and_dine.backend.modules.user.entity.User;
import com.scan_and_dine.backend.modules.user.mapper.UserMapper;
import com.scan_and_dine.backend.modules.user.repository.UserRepository;
import com.scan_and_dine.backend.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtConfig jwtConfig;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserMapper userMapper;

    public LoginResponseDto login(LoginRequestDto request) {
        log.info("User login attempt: {}", request.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                    (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
            User user = userPrincipal.getUser();

            String accessToken = jwtConfig.generateAccessToken(user.getEmail());
            String refreshToken = jwtConfig.generateRefreshToken(user.getEmail());

            saveRefreshToken(user, refreshToken);

            UserResponseDto userResponse = userMapper.toResponseDto(user);

            log.info("User logged in successfully: {}", user.getEmail());
            return LoginResponseDto.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(userResponse)
                    .build();

        } catch (Exception e) {
            log.error("Login failed for user: {}", e.getMessage());
            log.error("Login failed for user: {}", request.getEmail());
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public RefreshTokenResponseDto refreshToken(RefreshTokenRequestDto request) {
        log.info("Token refresh attempt");

        try {
            String refreshToken = request.getRefreshToken();
            
            if (!jwtConfig.isRefreshToken(refreshToken)) {
                throw new BadCredentialsException("Invalid refresh token type");
            }

            String email = jwtConfig.getEmailFromToken(refreshToken);
            
            RefreshToken storedToken = refreshTokenRepository.findByTokenAndIsRevokedFalse(refreshToken)
                    .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

            if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                refreshTokenRepository.revokeToken(refreshToken);
                throw new BadCredentialsException("Refresh token expired");
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            String newAccessToken = jwtConfig.generateAccessToken(email);
            String newRefreshToken = jwtConfig.generateRefreshToken(email);

            refreshTokenRepository.revokeToken(refreshToken);
            saveRefreshToken(user, newRefreshToken);

            log.info("Token refreshed successfully for user: {}", email);
            return RefreshTokenResponseDto.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .build();

        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw new BadCredentialsException("Invalid refresh token");
        }
    }

    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal userPrincipal) {
            User user = userPrincipal.getUser();
            
            refreshTokenRepository.revokeAllUserTokens(user);
            log.info("User logged out successfully: {}", user.getEmail());
        }
    }

    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal userPrincipal) {
            User user = userPrincipal.getUser();
            
            User freshUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    
            return userMapper.toResponseDto(freshUser);
        }
        throw new BadCredentialsException("User not authenticated");
    }

    private void saveRefreshToken(User user, String token) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(token);
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(refreshToken);
    }
} 