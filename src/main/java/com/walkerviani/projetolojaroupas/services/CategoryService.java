package com.walkerviani.projetolojaroupas.services;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.walkerviani.projetolojaroupas.entities.Category;
import com.walkerviani.projetolojaroupas.repositories.CategoryRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.CategoryNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import com.walkerviani.projetolojaroupas.services.exceptions.ValidationException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category findById(Long id) {
        Optional<Category> obj = categoryRepository.findById(id);
        return obj.orElseThrow(() -> new CategoryNotFoundException("Category not found"));
    }

    @Transactional
    public Category insert(Category obj) {
        validateCategory(obj);
        
        if (categoryRepository.existsByNameIgnoreCase(obj.getName()))
            throw new ValidationException("A category with this name already exists");
        return categoryRepository.save(obj);
    }

    @Transactional
    public void delete(Long id) {
        try {
            categoryRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new CategoryNotFoundException("Category not found");
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Cannot delete category: it has associated products.");
        }
    }

    @Transactional
    public Category update(Long id, Category obj) {
        try {
            Category entity = categoryRepository.getReferenceById(id);

            validateCategory(obj);

            if (!entity.getName().equalsIgnoreCase(obj.getName())
                    && categoryRepository.existsByNameIgnoreCase(obj.getName()))
                throw new ValidationException("A category with this name already exists");

            updateData(entity, obj);
            return categoryRepository.save(entity);
        } catch (EntityNotFoundException e) {
            throw new CategoryNotFoundException("Category not found");
        }
    }

    private void updateData(Category entity, Category obj) {
        entity.setName(obj.getName());
    }

    private void validateCategory(Category obj) {
        if (obj.getName() == null || obj.getName().trim().isEmpty())
            throw new ValidationException("Name is required");
        if (obj.getName().trim().length() < 3)
            throw new ValidationException("Name is too short");
        if (!obj.getName().matches("^[A-Za-zÀ-ÿ\\s]+$"))
            throw new ValidationException("Name must not have numbers");
    }
}
