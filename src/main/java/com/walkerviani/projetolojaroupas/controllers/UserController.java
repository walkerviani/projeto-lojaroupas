package com.walkerviani.projetolojaroupas.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Optional<User>> findByEmail(@RequestParam String email) {
        Optional<User> obj = userService.findByEmail(email);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping("/name")
    public ResponseEntity<Optional<User>> findByName(@RequestParam String name) {
        Optional<User> obj = userService.findByName(name);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping("/cpf")
    public ResponseEntity<Optional<User>> findByCpf(@RequestParam String cpf){
        Optional<User> obj = userService.findByCpf(cpf);
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
        String removeQuotes = newPassword.replaceAll("^\"|\"$", "").trim();
        User obj = userService.updatePassword(id, removeQuotes);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping(value = "/{id}/check-password")
    public ResponseEntity<Boolean> checkCurrentPassword(@PathVariable Long id, @RequestParam String password) {
        boolean isValid = userService.checkCurrentPassword(id, password);
        if(isValid) {
            return ResponseEntity.ok().body(isValid);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
