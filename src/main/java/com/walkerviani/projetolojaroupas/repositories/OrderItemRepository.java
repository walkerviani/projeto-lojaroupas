package com.walkerviani.projetolojaroupas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.walkerviani.projetolojaroupas.entities.OrderItem;
import com.walkerviani.projetolojaroupas.entities.pk.OrderItemPK;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemPK> {
}
