package com.scan_and_dine.backend.security;

import com.scan_and_dine.backend.config.JwtConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtConfig jwtConfig;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        try {
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt) && SecurityContextHolder.getContext().getAuthentication() == null) {
                validateAndAuthenticateToken(jwt, request);
            }
        } catch (Exception e) {
            log.error("JWT authentication failed: {}", e.getMessage());
            // Clear security context on authentication failure
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private void validateAndAuthenticateToken(String jwt, HttpServletRequest request) {
        // Validate token type - must be access token
        if (!jwtConfig.isAccessToken(jwt)) {
            log.warn("Invalid token type provided for authentication");
            return;
        }

        String email = jwtConfig.getEmailFromToken(jwt);
        
        if (!StringUtils.hasText(email)) {
            log.warn("No email found in JWT token");
            return;
        }

        // Validate token
        if (!jwtConfig.validateToken(jwt, email)) {
            log.warn("JWT token validation failed for email: {}", email);
            return;
        }

        // Load user and create authentication
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        
        if (!userDetails.isEnabled() || !userDetails.isAccountNonLocked() || 
            !userDetails.isAccountNonExpired() || !userDetails.isCredentialsNonExpired()) {
            log.warn("User account is not valid: {}", email);
            return;
        }

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        
        log.debug("Successfully authenticated user: {}", email);
    }
}