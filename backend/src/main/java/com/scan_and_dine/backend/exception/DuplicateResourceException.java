package com.scan_and_dine.backend.exception;

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
    
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
} 