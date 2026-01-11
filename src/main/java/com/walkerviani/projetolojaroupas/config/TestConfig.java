package com.walkerviani.projetolojaroupas.config;

import com.walkerviani.projetolojaroupas.entities.Category;
import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import com.walkerviani.projetolojaroupas.entities.enums.Size;
import com.walkerviani.projetolojaroupas.repositories.ClothesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {

    @Autowired
    private ClothesRepository clothesRepository;


    @Override
    public void run(String... args) throws Exception {

        Clothes clothes1 = new Clothes(null, "Red T-shirt", new BigDecimal("20.33"), "100% Cotton", "/images/image1.png", Size.MEDIUM, new Category("T-shirt"), Color.RED, 5);
        Clothes clothes2 = new Clothes(null, "Black skirt", new BigDecimal("12.42"), "45% Cotton, 55% Polyester", "/images/image2.png", Size.SMALL, new Category("Skirt"), Color.BLACK, 8);
        Clothes clothes3 = new Clothes(null, "Blue coat", new BigDecimal("45.43"), "90% Cotton, 10% wool", "/images/image3.png", Size.LARGE, new Category("Coat"), Color.BLUE, 9);

        clothesRepository.saveAll(Arrays.asList(clothes1, clothes2, clothes3));
    }
}
