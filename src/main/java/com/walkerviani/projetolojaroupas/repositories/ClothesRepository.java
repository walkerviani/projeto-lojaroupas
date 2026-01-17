package com.walkerviani.projetolojaroupas.repositories;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import com.walkerviani.projetolojaroupas.entities.enums.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClothesRepository extends JpaRepository<Clothes, Long> {

    List<Clothes> findByNameContainingIgnoreCase(String name);

    List<Clothes> findBySize(Size size);

    List<Clothes> findByColor(Color color);
}
