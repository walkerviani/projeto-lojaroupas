package com.walkerviani.projetolojaroupas.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.walkerviani.projetolojaroupas.entities.Order;
import com.walkerviani.projetolojaroupas.entities.OrderItem;
import com.walkerviani.projetolojaroupas.repositories.OrderRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import com.walkerviani.projetolojaroupas.services.exceptions.OrderNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Order findById(Long id) {
        Optional<Order> obj = orderRepository.findById(id);
        return obj.orElseThrow(() -> new OrderNotFoundException("Order not found"));
    }

    public Order insert(Order obj) {
        Instant moment = Instant.now();
        obj.setMoment(moment);
        if (obj.getPayment() != null) {
            obj.getPayment().setOrder(obj);
            obj.getPayment().setMoment(moment);
        }
        for(OrderItem item : obj.getItems()){
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
        entity.setMoment(obj.getMoment());
        entity.setOrderStatus(obj.getOrderStatus());
    }
}
