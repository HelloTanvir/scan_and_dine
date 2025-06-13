package com.scan_and_dine.backend.util;

import com.scan_and_dine.backend.modules.user.entity.User;
import com.scan_and_dine.backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminSetupService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createAdminIfNotExists();
    }

    private void createAdminIfNotExists() {
        String adminUsername = "admin";
        String adminEmail = "admin@scananddine.com";

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin user already exists, skipping creation");
            return;
        }

        User admin = new User();
        admin.setUsername(adminUsername);
        admin.setEmail(adminEmail);
        admin.setPhoneNumber("01234567890");
        admin.setPassword(passwordEncoder.encode("11223344"));
        admin.setRole(User.UserRole.ADMIN);
        admin.setStatus(User.UserStatus.ACTIVE);

        userRepository.save(admin);
        log.info("Default admin user created successfully:");
        log.info("Username: {}", adminUsername);
        log.info("Email: {}", adminEmail);
        log.info("Phone: 01234567890");
        log.info("Password: 11223344");
    }
}
