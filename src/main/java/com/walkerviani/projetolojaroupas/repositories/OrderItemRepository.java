package com.walkerviani.projetolojaroupas.repositories;

import com.walkerviani.projetolojaroupas.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
