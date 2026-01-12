package com.walkerviani.projetolojaroupas.services;

import com.walkerviani.projetolojaroupas.entities.Category;
import com.walkerviani.projetolojaroupas.repositories.CategoryRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.CategoryNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category findById(Long id) {
        Optional<Category> obj = categoryRepository.findById(id);
        return obj.orElseThrow(() -> new CategoryNotFoundException("Category not found"));
    }

    public Category insert(Category obj) {
        if (categoryRepository.existsByNameIgnoreCase(obj.getName())) {
            throw new DatabaseException("A category with this name already exists");
        }
        return categoryRepository.save(obj);
    }

    public void delete(Long id) {
        try {
            categoryRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new CategoryNotFoundException("Category not found");
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException(e.getMessage());
        }
    }

    public Category update(Long id, Category obj) {
        try {
            Category entity = categoryRepository.getReferenceById(id);
            updateData(entity, obj);
            return categoryRepository.save(entity);
        } catch (EntityNotFoundException e) {
            throw new CategoryNotFoundException("Category not found");
        }
    }

    private void updateData(Category entity, Category obj) {
        entity.setName(obj.getName());
    }

}
