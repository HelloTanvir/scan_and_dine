package com.scan_and_dine.backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
@Slf4j
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String origin = httpRequest.getHeader("Origin");
        
        // Set CORS headers
        httpResponse.setHeader("Access-Control-Allow-Origin", origin != null ? origin : "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", 
                "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, TRACE");
        httpResponse.setHeader("Access-Control-Allow-Headers", 
                "Accept, Accept-Language, Content-Language, Content-Type, Authorization, " +
                "X-Requested-With, X-HTTP-Method-Override, Cache-Control, Pragma, Origin, " +
                "User-Agent, DNT, Connection, Upgrade, Sec-WebSocket-Extensions, " +
                "Sec-WebSocket-Key, Sec-WebSocket-Version");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");
        httpResponse.setHeader("Access-Control-Expose-Headers", 
                "Authorization, Content-Type, Accept, X-Requested-With, Cache-Control");
        
        // Handle preflight requests
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            log.debug("Handling CORS preflight request for: {}", httpRequest.getRequestURI());
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        chain.doFilter(request, response);
    }
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        log.info("CORS Filter initialized");
    }
    
    @Override
    public void destroy() {
        log.info("CORS Filter destroyed");
    }
} 