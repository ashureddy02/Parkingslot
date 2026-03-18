package com.parking.parkingbackend.controller;

import com.parking.parkingbackend.dto.LoginRequest;
import com.parking.parkingbackend.dto.RegisterRequest;
import com.parking.parkingbackend.dto.AuthResponse;
import com.parking.parkingbackend.entity.User;
import com.parking.parkingbackend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTER API
    @PostMapping("/register")
    public String registerUser(@RequestBody RegisterRequest request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userService.saveUser(user);

        return "User Registered Successfully";
    }

    // LOGIN API (UPDATED WITH JWT)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest request) {

        String token = userService.login(request);

        return ResponseEntity.ok(new AuthResponse(token));
    }
}