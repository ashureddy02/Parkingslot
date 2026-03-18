package com.parking.parkingbackend.security;

import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final String SECRET_KEY = "parking-secret-key";

    // Generate Token
    public String generateToken(String email) {
        return email + "-jwt-token";
    }

    // Extract username from token
    public String extractUsername(String token) {
        if(token.contains("-jwt-token")) {
            return token.replace("-jwt-token", "");
        }
        return null;
    }
}