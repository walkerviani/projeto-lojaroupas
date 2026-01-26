package com.walkerviani.projetolojaroupas.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import com.walkerviani.projetolojaroupas.entities.enums.Size;
import com.walkerviani.projetolojaroupas.services.ClothesService;

@RestController
@RequestMapping(value = "/clothes")
public class ClothesController {

    @Autowired
    private ClothesService clothesService;

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
        List<Clothes> list = (name == null || name.isBlank())
                ? clothesService.findAll()
                : clothesService.findByName(name);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/size")
    public ResponseEntity<List<Clothes>> findBySize(@RequestParam(value = "size") Size size) {
        List<Clothes> list = clothesService.findBySize(size);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/color")
    public ResponseEntity<List<Clothes>> findByColor(@RequestParam(value = "color") Color color) {
        List<Clothes> list = clothesService.findByColor(color);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/category")
    public ResponseEntity<List<Clothes>> findByCategory(@RequestParam(value = "category") String categoryName){
        List<Clothes> list = clothesService.findByCategory(categoryName);
        return ResponseEntity.ok().body(list);
    }

    @PostMapping
    public ResponseEntity<Clothes> insert(@RequestBody Clothes obj) {
        obj = clothesService.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clothesService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Clothes> update(@PathVariable Long id, @RequestBody Clothes obj) {
        obj = clothesService.update(id, obj);
        return ResponseEntity.ok().body(obj);
    }
}
