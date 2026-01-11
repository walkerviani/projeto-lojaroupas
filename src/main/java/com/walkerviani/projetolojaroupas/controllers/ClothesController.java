package com.walkerviani.projetolojaroupas.controllers;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import com.walkerviani.projetolojaroupas.entities.enums.Size;
import com.walkerviani.projetolojaroupas.services.ClothesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

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
    public ResponseEntity<List<Clothes>> findBySize(@RequestParam(value = "size", required = false) Size size) {
        List<Clothes> list = clothesService.findBySize(size);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/category")
    public ResponseEntity<List<Clothes>> findByCategory(@RequestParam String name) {
        List<Clothes> list = clothesService.findByCategoryName(name);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/color")
    public ResponseEntity<List<Clothes>> findByColor(@RequestParam(value = "color", required = false) Color color) {
        List<Clothes> list = clothesService.findByColor(color);
        return ResponseEntity.ok().body(list);
    }

    @PatchMapping("/{id}/add-stock")
    public ResponseEntity<Void> addStock(@PathVariable Long id, @RequestParam int amount){
        clothesService.addStock(id, amount);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/remove-stock")
    public ResponseEntity<Void> removeStock(@PathVariable Long id, @RequestParam int amount){
        clothesService.removeStock(id, amount);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<Boolean> isStockAvailable(@PathVariable Long id,@RequestParam int  quantity) {
        boolean available = clothesService.isStockAvailable(id, quantity);
        return ResponseEntity.ok(available);
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
