package com.walkerviani.projetolojaroupas.controllers;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.entities.enums.Role;
import com.walkerviani.projetolojaroupas.services.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("LoggedUser");
        if (loggedUserId == null || !loggedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        User obj = userService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping
    public ResponseEntity<User> insert(@RequestBody User obj) {
        obj.setRole(Role.USER);
        obj = userService.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("LoggedUser");
        if (loggedUserId == null || !loggedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User obj, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("LoggedUser");
        if (loggedUserId == null || !loggedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        obj.setRole(null);
        obj = userService.update(id, obj);
        return ResponseEntity.ok().body(obj);
    }

    @PatchMapping(value = "/{id}")
    public ResponseEntity<User> updatePassword(@PathVariable Long id, @RequestBody String newPassword,
            HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("LoggedUser");
        if (loggedUserId == null || !loggedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        String cleanedPassword = newPassword.replaceAll("^\"|\"$", "").trim();
        User obj = userService.updatePassword(id, cleanedPassword);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping(value = "/{id}/check-password")
    public ResponseEntity<Boolean> checkCurrentPassword(@PathVariable Long id, @RequestBody String password,
            HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("LoggedUser");
        if (loggedUserId == null || !loggedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        String cleanedPassword = password.replaceAll("^\"|\"$", "").trim();
        boolean isValid = userService.checkCurrentPassword(id, cleanedPassword);

        return ResponseEntity.ok(isValid);
    }
}
