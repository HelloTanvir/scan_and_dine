package com.scan_and_dine.backend.config;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class PasswordConfig {
    
    public String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }
    
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}