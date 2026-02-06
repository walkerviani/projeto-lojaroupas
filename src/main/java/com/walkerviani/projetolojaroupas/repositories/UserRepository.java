package com.walkerviani.projetolojaroupas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.walkerviani.projetolojaroupas.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByCpf(String cpf);
}
