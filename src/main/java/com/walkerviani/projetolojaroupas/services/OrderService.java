package com.walkerviani.projetolojaroupas.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.Order;
import com.walkerviani.projetolojaroupas.entities.OrderItem;
import com.walkerviani.projetolojaroupas.repositories.ClothesRepository;
import com.walkerviani.projetolojaroupas.repositories.OrderRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.ClothesNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import com.walkerviani.projetolojaroupas.services.exceptions.OrderNotFoundException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ClothesRepository clothesRepository;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Order findById(Long id) {
        Optional<Order> obj = orderRepository.findById(id);
        return obj.orElseThrow(() -> new OrderNotFoundException("Order not found"));
    }

    public List<Order> findByClientId(Long clientId) {
        return orderRepository.findByClientId(clientId);
    }

    public Order insert(Order obj) {
        Instant moment = Instant.now();
        obj.setMoment(moment);
        if (obj.getPayment() != null) {
            obj.getPayment().setOrder(obj);
            obj.getPayment().setMoment(moment);
        }
        for (OrderItem item : obj.getItems()) {
            Clothes clothes = clothesRepository.findById(item.getClothes().getId())
                    .orElseThrow(() -> new ClothesNotFoundException("Product not found"));

            item.setPrice(clothes.getPrice());
            item.setOrder(obj);
        }
        return orderRepository.save(obj);
    }

    public void delete(Long id) {
        try {
            orderRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new OrderNotFoundException("Order not found");
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException(e.getMessage());
        }
    }

    @Transactional
    public Order update(Long id, Order obj) {
        try {
            Order entity = orderRepository.getReferenceById(id);
            updateData(entity, obj);
            return orderRepository.save(entity);
        } catch (EntityNotFoundException e) {
            throw new OrderNotFoundException("Order not found");
        }
    }

    private void updateData(Order entity, Order obj) {
        entity.setOrderStatus(obj.getOrderStatus());

        if (obj.getItems() != null) {

            entity.getItems().clear();

            obj.getItems().forEach(item -> {
                Clothes clothes = clothesRepository.findById(item.getClothes().getId())
                        .orElseThrow(() -> new ClothesNotFoundException("Product not found"));

                OrderItem newItem = new OrderItem(entity, clothes, item.getQuantity(), clothes.getPrice());
                entity.getItems().add(newItem);
            });
        }
    }
}
