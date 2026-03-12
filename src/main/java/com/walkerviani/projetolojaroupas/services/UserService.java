package com.walkerviani.projetolojaroupas.services;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.repositories.UserRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import com.walkerviani.projetolojaroupas.services.exceptions.UserNotFoundException;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        Optional<User> obj = userRepository.findById(id);
        return obj.orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByName(String name) {
        return userRepository.findByName(name);
    }

    public Optional<User> findByCpf(String cpf) {
        return userRepository.findByCpf(cpf);
    }

    public User insert(User obj) {
        obj.setPassword(passwordEncoder.encode(obj.getPassword()));
        return userRepository.save(obj);
    }

    public void delete(Long id) {
        try {
            userRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new UserNotFoundException("User not found");
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException(e.getMessage());
        }
    }

    public User update(Long id, User obj) {
        try {
            User entity = userRepository.getReferenceById(id);
            updateData(entity, obj);
            return userRepository.save(entity);
        } catch (EntityNotFoundException e) {
            throw new UserNotFoundException("User not found");
        }
    }

    private void updateData(User entity, User obj) {
        entity.setName(obj.getName());
        entity.setEmail(obj.getEmail());
        entity.setPhone(obj.getPhone());
        entity.setCpf(obj.getCpf());
        entity.setRole(obj.getRole());
    }

    public User updatePassword(Long id, String newPassword) {
        User entity = userRepository.getReferenceById(id);
        entity.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(entity);
    }

    public boolean checkCurrentPassword(Long id, String password) {
        User entity = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return passwordEncoder.matches(password, entity.getPassword());
    }
}
