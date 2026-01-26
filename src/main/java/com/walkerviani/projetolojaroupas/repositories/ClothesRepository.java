package com.walkerviani.projetolojaroupas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import com.walkerviani.projetolojaroupas.entities.enums.Size;

public interface ClothesRepository extends JpaRepository<Clothes, Long> {

    List<Clothes> findByNameContainingIgnoreCase(String name);

    List<Clothes> findBySize(Size size);

    List<Clothes> findByColor(Color color);

    List<Clothes> findByCategoryNameIgnoreCase(String name);
}
