package com.walkerviani.projetolojaroupas.controllers;

import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

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
    public ResponseEntity<User> findByEmail(@RequestParam(value = "email") String email) {
        User obj = userService.findByEmail(email);
        return ResponseEntity.ok().body(obj);
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
