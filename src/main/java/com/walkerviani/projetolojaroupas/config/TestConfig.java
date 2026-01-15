package com.walkerviani.projetolojaroupas.config;

import com.walkerviani.projetolojaroupas.entities.Category;
import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.Order;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import com.walkerviani.projetolojaroupas.entities.enums.OrderStatus;
import com.walkerviani.projetolojaroupas.entities.enums.Size;
import com.walkerviani.projetolojaroupas.repositories.CategoryRepository;
import com.walkerviani.projetolojaroupas.repositories.ClothesRepository;
import com.walkerviani.projetolojaroupas.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {

    @Autowired
    private ClothesRepository clothesRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public void run(String... args) throws Exception {

        Category cat1 = new Category("Tshirt");
        Category cat2 = new Category("Skirt");
        Category cat3 = new Category("Coat");

        Clothes clothes1 = new Clothes("Red Tshirt", new BigDecimal("20.33"), "100% Cotton", "/images/image1.png", Size.MEDIUM, cat1, Color.RED, 5);
        Clothes clothes2 = new Clothes("Black skirt", new BigDecimal("12.42"), "45% Cotton, 55% Polyester", "/images/image2.png", Size.SMALL, cat2, Color.BLACK, 8);
        Clothes clothes3 = new Clothes("Blue coat", new BigDecimal("45.43"), "90% Cotton, 10% wool", "/images/image3.png", Size.LARGE, cat3, Color.BLUE, 9);


        Order ord1 = new Order(Instant.now(), OrderStatus.PAID);
        Order ord2 = new Order(Instant.now(), OrderStatus.WAITING_PAYMENT);


        categoryRepository.saveAll(Arrays.asList(cat1, cat2, cat3));
        clothesRepository.saveAll(Arrays.asList(clothes1, clothes2, clothes3));
        orderRepository.saveAll(Arrays.asList(ord1, ord2));
    }
}
