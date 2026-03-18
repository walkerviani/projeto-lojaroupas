package com.walkerviani.projetolojaroupas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.walkerviani.projetolojaroupas.entities.Clothes;

public interface ClothesRepository extends JpaRepository<Clothes, Long> {

    List<Clothes> findByNameContainingIgnoreCase(String name);

    List<Clothes> findByCategoryNameIgnoreCase(String name);

    boolean existsByCategoryId(Long categoryId);
}
