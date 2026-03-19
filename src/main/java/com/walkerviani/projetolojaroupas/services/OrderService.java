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
import com.walkerviani.projetolojaroupas.entities.Payment;
import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.repositories.ClothesRepository;
import com.walkerviani.projetolojaroupas.repositories.OrderRepository;
import com.walkerviani.projetolojaroupas.repositories.UserRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.ClothesNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import com.walkerviani.projetolojaroupas.services.exceptions.OrderNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.UserNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.ValidationException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ClothesRepository clothesRepository;
    private final UserRepository userRepository;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Order findById(Long id) {
        Optional<Order> obj = orderRepository.findById(id);
        return obj.orElseThrow(() -> new OrderNotFoundException("Order not found"));
    }

    public List<Order> findByClientId(Long clientId) {
        if (clientId == null || clientId <= 0) {
            throw new ValidationException("Provide a valid user ID");
        }
        return orderRepository.findByClientId(clientId);
    }

    @Transactional
    public Order insert(Order obj) {
        validateOrder(obj);

        Instant moment = Instant.now();
        obj.setMoment(moment);

        if (obj.getPayment() != null) {
            throw new ValidationException("Payment must be empty");
        }

        User client = userRepository.findById(obj.getClient().getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        obj.setClient(client);

        obj.setPayment(new Payment());
        obj.getPayment().setOrder(obj);
        obj.getPayment().setMoment(moment);

        for (OrderItem item : obj.getItems()) {
            Clothes clothes = clothesRepository.findById(item.getClothes().getId())
                    .orElseThrow(() -> new ClothesNotFoundException("Product not found"));
            validateItem(item);
            item.setPrice(clothes.getPrice());
            item.setOrder(obj);
        }
        return orderRepository.save(obj);
    }

    @Transactional
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
        validateOrder(obj);
        entity.setOrderStatus(obj.getOrderStatus());

        User client = userRepository.findById(obj.getClient().getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        entity.setClient(client);

        entity.getItems().clear();

        obj.getItems().forEach(item -> {
            Clothes clothes = clothesRepository.findById(item.getClothes().getId())
                    .orElseThrow(() -> new ClothesNotFoundException("Product not found"));
            validateItem(item);
            OrderItem newItem = new OrderItem(entity, clothes, item.getQuantity(), clothes.getPrice());
            entity.getItems().add(newItem);
        });

    }

    private void validateOrder(Order obj) {
        if (obj == null) {
            throw new ValidationException("Order cannot be null");
        }
        if (obj.getClient() == null || obj.getClient().getId() == null) {
            throw new ValidationException("Order must have a valid client");
        }
        if (obj.getItems() == null || obj.getItems().isEmpty()) {
            throw new ValidationException("Order must have at least one item");
        }
        if (obj.getOrderStatus() == null) {
            throw new ValidationException("You must select a valid order status");
        }
    }

    private void validateItem(OrderItem item) {
        if (item.getQuantity() <= 0) {
            throw new ValidationException("Quantity must be greater than 0");
        }
    }
}
