package com.walkerviani.projetolojaroupas.repositories;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
public interface ClothesRepository extends JpaRepository<Clothes, Long> {

    List<Clothes> findByNameContainingIgnoreCase(String name);

    List<Clothes> findByColor(Color color);
}
