package com.walkerviani.projetolojaroupas.controllers;

import java.net.URI;

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

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id, HttpSession session) {
        User loggedUser = (User) session.getAttribute("LoggedUser");
        if(loggedUser == null || !loggedUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        User obj = userService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping
    public ResponseEntity<User> insert(@RequestBody User obj) {
        obj = userService.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpSession session) {
        User loggedUser = (User) session.getAttribute("LoggedUser");
        if(loggedUser == null || !loggedUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User obj, HttpSession session) {
        User loggedUser = (User) session.getAttribute("LoggedUser");
        if(loggedUser == null || !loggedUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        obj.setRole(null);
        obj = userService.update(id, obj);
        return ResponseEntity.ok().body(obj);
    }

    @Transactional
    @PatchMapping(value = "/{id}")
    public ResponseEntity<User> updatePassword(@PathVariable Long id, @RequestBody String newPassword, HttpSession session) {
        User loggedUser = (User) session.getAttribute("LoggedUser");
        if(loggedUser == null || !loggedUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        String removeQuotes = newPassword.replaceAll("^\"|\"$", "").trim();
        User obj = userService.updatePassword(id, removeQuotes);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping(value = "/{id}/check-password")
    public ResponseEntity<Boolean> checkCurrentPassword(@PathVariable Long id, @RequestParam String password, HttpSession session) {
        User loggedUser = (User) session.getAttribute("LoggedUser");
        if(loggedUser == null || !loggedUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        boolean isValid = userService.checkCurrentPassword(id, password);
        if(isValid) {
            return ResponseEntity.ok().body(isValid);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
