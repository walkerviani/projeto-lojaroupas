package com.walkerviani.projetolojaroupas.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import com.walkerviani.projetolojaroupas.entities.enums.Size;
import com.walkerviani.projetolojaroupas.repositories.ClothesRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.ClothesNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ClothesService {

    @Autowired
    private ClothesRepository clothesRepository;

    public List<Clothes> findAll() {
        return clothesRepository.findAll();
    }

    public Clothes findById(Long id) {
        Optional<Clothes> clothes = clothesRepository.findById(id);
        return clothes.orElseThrow(() -> new ClothesNotFoundException(id));
    }

    public List<Clothes> findByName(String name) {
        return clothesRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Clothes> findBySize(Size size) {
        return clothesRepository.findBySize(size);
    }

    public List<Clothes> findByColor(Color color) {
        return clothesRepository.findByColor(color);
    }

    public List<Clothes> findByCategory(String category){
        return clothesRepository.findByCategoryNameIgnoreCase(category);
    }

    public Clothes insert(Clothes obj) {
        return clothesRepository.save(obj);
    }

    public void delete(Long id) {
        try {
            clothesRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ClothesNotFoundException(id);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException(e.getMessage());
        }
    }

    public Clothes update(Long id, Clothes obj) {
        try {
            Clothes entity = clothesRepository.getReferenceById(id);
            updateData(entity, obj);
            return clothesRepository.save(entity);
        } catch (EntityNotFoundException e) {
            throw new ClothesNotFoundException(id);
        }

    }

    private void updateData(Clothes entity, Clothes obj) {
        entity.setName(obj.getName());
        entity.setPrice(obj.getPrice());
        entity.setDescription(obj.getDescription());
        entity.setColor(obj.getColor());
        entity.setSize(obj.getSize());
        entity.setCategory(obj.getCategory());
        entity.setImageUrl(obj.getImageUrl());
    }
}
