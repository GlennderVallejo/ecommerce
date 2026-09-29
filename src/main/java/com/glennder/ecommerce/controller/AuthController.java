package com.glennder.ecommerce.controller;

import com.glennder.ecommerce.dto.AuthResponse;
import com.glennder.ecommerce.dto.LoginRequest;
import com.glennder.ecommerce.dto.RegisterRequest;
import com.glennder.ecommerce.dto.UserResponse;
import com.glennder.ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
            @Valid @RequestBody RegisterRequest request) {

        return userService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request) {

        return userService.login(request);
    }
}