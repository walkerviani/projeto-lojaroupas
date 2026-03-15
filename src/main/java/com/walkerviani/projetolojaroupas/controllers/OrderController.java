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

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{id}")
    public ResponseEntity<Order> findById(@PathVariable Long id, HttpSession session) {
        User loggedUser = (User) session.getAttribute("LoggedUser");
        if(loggedUser == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Order obj = orderService.findById(id);

        if(!obj.getClient().getId().equals(loggedUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping(value = "/client/{clientId}")
    public ResponseEntity<List<Order>> findByClientId(@PathVariable Long clientId, HttpSession session) {
        User loggedUser = (User) session.getAttribute("LoggedUser");
        if(loggedUser == null || !loggedUser.getId().equals(clientId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Order> list = orderService.findByClientId(clientId);
        return ResponseEntity.ok().body(list);
    }

    @PostMapping
    public ResponseEntity<Order> insert(@RequestBody Order obj, HttpSession session) {
        User loggedUser = (User) session.getAttribute("LoggedUser");
        if(loggedUser == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        obj.setClient(loggedUser);
        obj = orderService.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }
}
