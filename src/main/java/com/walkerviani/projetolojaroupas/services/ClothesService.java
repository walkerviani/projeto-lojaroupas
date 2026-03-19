package com.walkerviani.projetolojaroupas.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.ImageData;
import com.walkerviani.projetolojaroupas.repositories.CategoryRepository;
import com.walkerviani.projetolojaroupas.repositories.ClothesRepository;
import com.walkerviani.projetolojaroupas.repositories.OrderItemRepository;
import com.walkerviani.projetolojaroupas.repositories.StorageRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.ClothesNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import com.walkerviani.projetolojaroupas.services.exceptions.ImageNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.ValidationException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ClothesService {

    private final ClothesRepository clothesRepository;
    private final StorageRepository storageRepository;
    private final OrderItemRepository orderItemRepository;
    private final CategoryRepository categoryRepository;

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

    public List<Clothes> findByCategory(String category) {
        return clothesRepository.findByCategoryNameIgnoreCase(category);
    }

    @Transactional
    public Clothes insert(Clothes obj) {
        validateClothes(obj);

        if (obj.getImageData() == null) {
            throw new ValidationException("You must select an image");
        }
        if (obj.getImageData().getName() == null) {
            throw new ImageNotFoundException("Image not found!");
        }
        ImageData image = storageRepository.findByName(obj.getImageData().getName())
                .orElseThrow(() -> new ImageNotFoundException("Image not found!"));
        obj.setImageData(image);

        return clothesRepository.save(obj);
    }

    @Transactional
    public void delete(Long id) {
        Clothes clothes = clothesRepository.findById(id)
                .orElseThrow(() -> new ClothesNotFoundException("Clothes not found"));

        if (orderItemRepository.existsByClothesId(id)) {
            throw new DatabaseException("Cannot delete clothes: it have associated orders.");
        }

        clothesRepository.delete(clothes);
    }

    @Transactional
    public Clothes update(Long id, Clothes obj) {
        Clothes entity = clothesRepository.findById(id)
                .orElseThrow(() -> new ClothesNotFoundException("Clothes not found"));
        validateClothes(obj);
        updateData(entity, obj);
        return clothesRepository.save(entity);
    }

    private void updateData(Clothes entity, Clothes obj) {
        entity.setName(obj.getName());
        entity.setPrice(obj.getPrice());
        entity.setDescription(obj.getDescription());
        entity.setColor(obj.getColor());
        entity.setSize(obj.getSize());
        entity.setCategory(obj.getCategory());

        if (obj.getImageData() == null) {
            throw new ValidationException("You must select an image");
        }
        if (obj.getImageData().getName() == null) {
            throw new ImageNotFoundException("Image not found!");
        }

        ImageData newImage = storageRepository.findByName(obj.getImageData().getName())
                .orElseThrow(() -> new ImageNotFoundException("Image not found!"));

        entity.setImageData(newImage);
    }

    private void validateClothes(Clothes obj) {
        // Name validation
        if (obj.getName() == null)
            throw new ValidationException("Name is required");
        if (obj.getName().length() < 3)
            throw new ValidationException("Name is too short (Min. 3 characters)");
        if (!obj.getName().matches("^[A-Za-zÀ-ÿ\\s]+$"))
            throw new ValidationException("Name must not have numbers");

        // Price validation
        if (obj.getPrice() == null)
            throw new ValidationException("Price is required");
        if (obj.getPrice().compareTo(BigDecimal.ZERO) <= 0)
            throw new ValidationException("Price must be greater than 0");

        // Description validation
        if (obj.getDescription() == null)
            throw new ValidationException("Description is required");

        // Size validation
        if (obj.getSize() == null)
            throw new ValidationException("You must select a valid size");

        // Color validation
        if (obj.getColor() == null)
            throw new ValidationException("You must select a valid color");

        // Category validation
        if (obj.getCategory() == null)
            throw new ValidationException("You must select a valid category");
        categoryRepository.findById(obj.getCategory().getId())
                .orElseThrow(() -> new ValidationException("You must select a valid category"));
    }
}
