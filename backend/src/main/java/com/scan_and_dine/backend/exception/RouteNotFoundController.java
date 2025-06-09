package com.scan_and_dine.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import java.util.Map;

@RestController
@Slf4j
public class RouteNotFoundController implements ErrorController {

    private final ErrorAttributes errorAttributes;

    public RouteNotFoundController(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        WebRequest webRequest = new ServletWebRequest(request);
        Map<String, Object> errorAttributesMap = errorAttributes.getErrorAttributes(
                webRequest, ErrorAttributeOptions.of(
                        ErrorAttributeOptions.Include.MESSAGE,
                        ErrorAttributeOptions.Include.BINDING_ERRORS
                )
        );

        Integer status = (Integer) errorAttributesMap.get("status");
        HttpStatus httpStatus = HttpStatus.valueOf(status != null ? status : 500);

        String path = (String) errorAttributesMap.get("path");
        log.warn("Error occurred: {} - Status: {}", path, status);

        return new ResponseEntity<>(errorAttributesMap, httpStatus);
    }
} 