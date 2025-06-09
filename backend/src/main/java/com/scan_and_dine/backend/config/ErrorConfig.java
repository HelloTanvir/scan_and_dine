package com.scan_and_dine.backend.config;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.Map;

@Configuration
public class ErrorConfig {

    @Bean
    public DefaultErrorAttributes errorAttributes() {
        return new DefaultErrorAttributes() {
            @Override
            public Map<String, Object> getErrorAttributes(WebRequest webRequest, ErrorAttributeOptions options) {
                Map<String, Object> errorAttributes = super.getErrorAttributes(webRequest, options);
                
                // Replace timestamp with LocalDateTime format
                errorAttributes.put("timestamp", LocalDateTime.now());
                
                // Ensure we have proper error message for 404
                Integer status = (Integer) errorAttributes.get("status");
                if (status != null && status == 404) {
                    String path = (String) errorAttributes.get("path");
                    errorAttributes.put("message", "The requested route '" + path + "' was not found");
                    errorAttributes.put("error", "Not Found");
                }
                
                // Remove unnecessary fields
                errorAttributes.remove("trace");
                errorAttributes.remove("exception");
                
                return errorAttributes;
            }
        };
    }
} 