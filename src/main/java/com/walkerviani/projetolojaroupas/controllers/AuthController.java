package com.walkerviani.projetolojaroupas.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.services.AuthService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/auth")
public class AuthController {

    private final AuthService authService;

    public record LoginInput(String email, String password) {
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginInput input, HttpSession session) {
        try {
            User user = authService.authUser(input.email(), input.password());
            session.setAttribute("LoggedUser", user.getId());
            session.setAttribute("UserRole", user.getRole().name());
            return ResponseEntity.ok(Map.of("message", "Login successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check")
    public ResponseEntity<?> getAuthUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("LoggedUser");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        try {
            User user = authService.findUserById(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
