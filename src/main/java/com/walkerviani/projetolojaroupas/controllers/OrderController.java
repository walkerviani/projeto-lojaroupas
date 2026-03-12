package com.walkerviani.projetolojaroupas.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.walkerviani.projetolojaroupas.entities.Order;
import com.walkerviani.projetolojaroupas.services.OrderService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> findAll() {
        return ResponseEntity.ok().body(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> findById(@PathVariable Long id) {
        Order obj = orderService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping(value = "/client/{clientId}")
    public ResponseEntity<List<Order>> findByClientId(@PathVariable Long clientId) {
        List<Order> list = orderService.findByClientId(clientId);
        return ResponseEntity.ok().body(list);
    }

    @PostMapping
    public ResponseEntity<Order> insert(@RequestBody Order obj) {
        obj = orderService.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody Order obj) {
        obj = orderService.update(id, obj);
        return ResponseEntity.ok().body(obj);
    }
}
