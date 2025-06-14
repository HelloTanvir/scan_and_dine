package com.scan_and_dine.backend.util;

import com.scan_and_dine.backend.modules.user.entity.User;
import com.scan_and_dine.backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@Order(2) // Run after AdminSetupService
public class UserSetupService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createManagerIfNotExists();
        createStaffAccountsIfNotExists();
    }

    private void createManagerIfNotExists() {
        String managerUsername = "manager";
        String managerEmail = "manager@scananddine.com";

        if (userRepository.existsByEmail(managerEmail)) {
            log.info("Manager user already exists, skipping creation");
            return;
        }

        User manager = new User();
        manager.setUsername(managerUsername);
        manager.setEmail(managerEmail);
        manager.setPhoneNumber("01234567891");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setRole(User.UserRole.MANAGER);
        manager.setStatus(User.UserStatus.ACTIVE);

        userRepository.save(manager);
        log.info("Default manager user created successfully:");
        log.info("Username: {}", managerUsername);
        log.info("Email: {}", managerEmail);
        log.info("Phone: 01234567891");
        log.info("Password: manager123");
    }

    private void createStaffAccountsIfNotExists() {
        createStaffAccount("staff1", "staff1@scananddine.com", "01234567892", "staff123");
        createStaffAccount("staff2", "staff2@scananddine.com", "01234567893", "staff123");
        createStaffAccount("staff3", "staff3@scananddine.com", "01234567894", "staff123");
    }

    private void createStaffAccount(String username, String email, String phone, String password) {
        if (userRepository.existsByEmail(email)) {
            log.info("Staff user {} already exists, skipping creation", username);
            return;
        }

        User staff = new User();
        staff.setUsername(username);
        staff.setEmail(email);
        staff.setPhoneNumber(phone);
        staff.setPassword(passwordEncoder.encode(password));
        staff.setRole(User.UserRole.STAFF);
        staff.setStatus(User.UserStatus.ACTIVE);

        userRepository.save(staff);
        log.info("Default staff user created successfully:");
        log.info("Username: {}", username);
        log.info("Email: {}", email);
        log.info("Phone: {}", phone);
        log.info("Password: {}", password);
    }
} 