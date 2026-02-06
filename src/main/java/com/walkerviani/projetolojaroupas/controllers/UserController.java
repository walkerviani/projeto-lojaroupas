package com.walkerviani.projetolojaroupas.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.services.UserService;


@RestController
@RequestMapping(value = "/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok().body(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        User obj = userService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping("/email")
    public ResponseEntity<User> findByEmail(@RequestParam String email) {
        User obj = userService.findByEmail(email);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping("/cpf")
    public ResponseEntity<User> findByCpf(@RequestParam String cpf){
        User obj = userService.findByCpf(cpf);
        return ResponseEntity.ok().body(obj);
    }

    public String getMethodName(@RequestParam String param) {
        return new String();
    }
    

    @PostMapping
    public ResponseEntity<User> insert(@RequestBody User obj) {
        obj = userService.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User obj) {
        obj = userService.update(id, obj);
        return ResponseEntity.ok().body(obj);
    }

    @Transactional
    @PatchMapping(value = "/{id}")
    public ResponseEntity<User> updatePassword(@PathVariable Long id, @RequestBody String newPassword) {
        String s = newPassword.replaceAll("^\"|\"$", "").trim();
        User obj = userService.updatePassword(id, s);
        return ResponseEntity.ok().body(obj);
    }

}
