package com.walkerviani.projetolojaroupas.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public User authUser(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> encoder.matches(password, user.getPassword()))
                .orElseThrow(() -> new RuntimeException("E-mail or password invalid!"));
    }

    public User findUserById(Long id){
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Not authenticated"));
    }
}
