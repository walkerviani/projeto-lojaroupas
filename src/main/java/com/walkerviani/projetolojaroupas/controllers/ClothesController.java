package com.walkerviani.projetolojaroupas.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.services.ClothesService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/clothes")
public class ClothesController {

    private final ClothesService clothesService;

    @GetMapping
    public ResponseEntity<List<Clothes>> findAll() {
        return ResponseEntity.ok().body(clothesService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clothes> findById(@PathVariable Long id) {
        Clothes obj = clothesService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping("/name")
    public ResponseEntity<List<Clothes>> findByName(@RequestParam(value = "name", required = false) String name) {
        List<Clothes> list = clothesService.findByName(name);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/category")
    public ResponseEntity<List<Clothes>> findByCategory(@RequestParam(value = "category") String categoryName){
        List<Clothes> list = clothesService.findByCategory(categoryName);
        return ResponseEntity.ok().body(list);
    }
}
