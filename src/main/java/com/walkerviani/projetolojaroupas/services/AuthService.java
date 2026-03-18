package com.walkerviani.projetolojaroupas.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.repositories.UserRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.UserNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.ValidationException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public User authUser(String email, String password) {
        if (email == null || email.trim().isEmpty())
            throw new ValidationException("Email is required");
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
            throw new ValidationException("Email is not valid");
        if (password == null || password.trim().isEmpty())
            throw new ValidationException("Password is required");

        return userRepository.findByEmail(email)
                .filter(user -> encoder.matches(password, user.getPassword()))
                .orElseThrow(() -> new ValidationException("E-mail or password invalid!"));
    }

    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Not authenticated"));
    }
}
