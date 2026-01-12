package com.walkerviani.projetolojaroupas.repositories;

import com.walkerviani.projetolojaroupas.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByNameIgnoreCase(String name);
}
