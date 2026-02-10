package com.walkerviani.projetolojaroupas.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.walkerviani.projetolojaroupas.entities.ImageData;

public interface StorageRepository extends JpaRepository<ImageData, Long>{
    Optional<ImageData> findByName(String name);
}
