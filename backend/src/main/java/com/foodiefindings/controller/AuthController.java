package com.foodiefindings.controller;

import com.foodiefindings.dto.AuthRequest;
import com.foodiefindings.dto.AuthResponse;
import com.foodiefindings.dto.RegisterRequest;
import com.foodiefindings.entity.User;
import com.foodiefindings.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(new AuthResponse(
                null,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getLatitude(),
                user.getLongitude(),
                user.getLocation(),
                user.getVerified()
        ));
    }
}
