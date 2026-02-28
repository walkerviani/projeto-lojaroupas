package com.walkerviani.projetolojaroupas.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.walkerviani.projetolojaroupas.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByCpf(String cpf);
    Optional<User> findByName(String name);
}
