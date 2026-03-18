package com.walkerviani.projetolojaroupas.services;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.repositories.OrderRepository;
import com.walkerviani.projetolojaroupas.repositories.UserRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import com.walkerviani.projetolojaroupas.services.exceptions.UserNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.ValidationException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
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

    public Optional<User> findByCpf(String cpf) {
        return userRepository.findByCpf(cpf);
    }

    @Transactional
    public User insert(User obj) {
        validateUser(obj);

        if (findByEmail(obj.getEmail()).isPresent())
            throw new ValidationException("Email is already in use");
        if (findByCpf(obj.getCpf()).isPresent())
            throw new ValidationException("CPF is already in use");

        if (obj.getPassword() == null || obj.getPassword().trim().isEmpty()) {
            throw new ValidationException("Password is required");
        }
        if (obj.getPassword().trim().length() < 8) {
            throw new ValidationException("Password is too short (Minimum 8 digits)");
        }

        obj.setPassword(passwordEncoder.encode(obj.getPassword()));
        return userRepository.save(obj);
    }

    @Transactional
    public void delete(Long id) {
        User entity = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if(orderRepository.existsByUserId(id)) {
            throw new DatabaseException("Cannot delete user: they have associated orders.");
        }

        userRepository.delete(entity);
    }

    @Transactional
    public User update(Long id, User obj) {
        try {
            User entity = userRepository.getReferenceById(id);

            validateUser(obj);

            if (findByEmail(obj.getEmail()).isPresent() && !entity.getEmail().equals(obj.getEmail())) {
                throw new ValidationException("Email is already in use");
            }
            if (findByCpf(obj.getCpf()).isPresent() && !entity.getCpf().equals(obj.getCpf())) {
                throw new ValidationException("CPF is already in use");
            }

            updateData(entity, obj);
            return userRepository.save(entity);
        } catch (EntityNotFoundException e) {
            throw new UserNotFoundException("User not found");
        }
    }

    private void updateData(User entity, User obj) {
        entity.setPhone(obj.getPhone());
        entity.setEmail(obj.getEmail());
        entity.setName(obj.getName());
        entity.setCpf(obj.getCpf());
        entity.setRole(obj.getRole());
    }

    @Transactional
    public User updatePassword(Long id, String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new ValidationException("Password is required");
        }
        if (newPassword.trim().length() < 8) {
            throw new ValidationException("Password is too short (Minimum 8 digits)");
        }

        try {
            User entity = userRepository.getReferenceById(id);
            entity.setPassword(passwordEncoder.encode(newPassword));
            return userRepository.save(entity);
        } catch (EntityNotFoundException e) {
            throw new UserNotFoundException("User not found");
        }
    }

    public boolean checkCurrentPassword(Long id, String password) {
        User entity = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return passwordEncoder.matches(password, entity.getPassword());
    }

    private void validateUser(User obj) {
        // Name verification
        if (obj.getName() == null || obj.getName().trim().isEmpty())
            throw new ValidationException("Name is required");
        if (obj.getName().trim().length() < 3)
            throw new ValidationException("Name is too short");
        if (!obj.getName().matches("^[A-Za-zÀ-ÿ\\s]+$"))
            throw new ValidationException("Name must not have numbers");

        // Email verification
        if (obj.getEmail() == null || obj.getEmail().trim().isEmpty())
            throw new ValidationException("Email is required");
        if (!obj.getEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
            throw new ValidationException("Email is not valid");

        // CPF verification
        if (obj.getCpf() == null || obj.getCpf().trim().isEmpty())
            throw new ValidationException("Cpf is required");
        if (obj.getCpf().trim().length() != 11)
            throw new ValidationException("Cpf must have 11 digits");
        if (!obj.getCpf().matches("^[0-9]+$"))
            throw new ValidationException("Cpf must have only numbers");

        // Phone verification
        if (obj.getPhone() == null || obj.getPhone().trim().isEmpty())
            throw new ValidationException("Phone is required");
        if (obj.getPhone().trim().length() != 11)
            throw new ValidationException("Phone is too short");
        if (!obj.getPhone().matches("^[0-9]+$"))
            throw new ValidationException("Phone must have only numbers");

        // Role verification
        if (obj.getRole() == null)
            throw new ValidationException("Role is required");
    }
}
