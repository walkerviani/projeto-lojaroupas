package com.walkerviani.projetolojaroupas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.walkerviani.projetolojaroupas.entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByClientId(Long clientId);

    boolean existsByClientId(Long userId);
}
