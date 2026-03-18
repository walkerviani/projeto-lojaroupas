package com.walkerviani.projetolojaroupas.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.walkerviani.projetolojaroupas.entities.Order;
import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.services.OrderService;
import com.walkerviani.projetolojaroupas.services.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<Order> findById(@PathVariable Long id, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("LoggedUser");
        if(loggedUserId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Order obj = orderService.findById(id);
        if(obj == null) {
            return ResponseEntity.notFound().build();
        }
        if(obj.getClient() == null || !obj.getClient().getId().equals(loggedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(obj);
    }

    @GetMapping(value = "/client/{clientId}")
    public ResponseEntity<List<Order>> findByClientId(@PathVariable Long clientId, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("LoggedUser");
        if(loggedUserId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if(!loggedUserId.equals(clientId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Order> list = orderService.findByClientId(clientId);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<Order> insert(@RequestBody Order obj, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("LoggedUser");
        if(loggedUserId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        User entity = userService.findById(loggedUserId);
        if(entity == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        obj.setClient(entity);
        obj = orderService.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }
}
