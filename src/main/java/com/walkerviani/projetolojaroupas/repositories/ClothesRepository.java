package com.walkerviani.projetolojaroupas.repositories;

import com.walkerviani.projetolojaroupas.entities.Clothes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClothesRepository extends JpaRepository<Clothes, Long> {
}
