package com.walkerviani.projetolojaroupas.config;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.walkerviani.projetolojaroupas.entities.Category;
import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.ImageData;
import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import com.walkerviani.projetolojaroupas.entities.enums.Role;
import com.walkerviani.projetolojaroupas.entities.enums.Size;
import com.walkerviani.projetolojaroupas.repositories.CategoryRepository;
import com.walkerviani.projetolojaroupas.repositories.ClothesRepository;
import com.walkerviani.projetolojaroupas.repositories.UserRepository;
import com.walkerviani.projetolojaroupas.util.ImageUtils;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

        private final ClothesRepository clothesRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;
        private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (clothesRepository.count() == 0) {

            // Categories
            List<Category> categories = categoryRepository.findAll();
            Category Shirt = categories.stream().filter(c -> c.getName().equalsIgnoreCase("Shirt"))
                    .findFirst().orElse(null);
            Category Skirt = categories.stream().filter(c -> c.getName().equalsIgnoreCase("Skirt"))
                    .findFirst().orElse(null);
            Category Coat = categories.stream().filter(c -> c.getName().equalsIgnoreCase("Coat"))
                    .findFirst().orElse(null);

            // Users
            User admin = new User("Admin", "admin@gmail.com", "18273849374", passwordEncoder.encode(("12345678")), "10244333522", Role.ADMIN);
            User robert = new User("Robert", "robert@gmail.com", "38492837434", passwordEncoder.encode(("87654321")), "19454235413", Role.USER);
            userRepository.saveAll(Arrays.asList(admin, robert));

            // Images
            ImageData img1 = ImageData.builder()
                    .name("image1.jpg")
                    .type("image/jpeg")
                    .imageData(ImageUtils.compressImage(
                            new ClassPathResource("static/images/image1.jpg").getContentAsByteArray()))
                    .build();

            ImageData img2 = ImageData.builder()
                    .name("image2.jpg")
                    .type("image/jpeg")
                    .imageData(ImageUtils.compressImage(
                            new ClassPathResource("static/images/image2.jpg").getContentAsByteArray()))
                    .build();


            ImageData img3 = ImageData.builder()
                    .name("image3.jpg")
                    .type("image/jpeg")
                    .imageData(ImageUtils.compressImage(
                            new ClassPathResource("static/images/image3.jpg").getContentAsByteArray()))
                    .build();

            Clothes clothes1 = new Clothes("Red Shirt", new BigDecimal("20.00"), "100% Cotton", img1,
                    Size.MEDIUM, Shirt, Color.RED);
            Clothes clothes2 = new Clothes("Black Skirt", new BigDecimal("12.42"), "45% Cotton, 55% Polyester",
                    img2, Size.SMALL, Skirt, Color.BLACK);
            Clothes clothes3 = new Clothes("Blue Coat", new BigDecimal("45.43"), "90% Cotton, 10% wool",
                    img3, Size.LARGE, Coat, Color.BLUE);

            clothesRepository.saveAll(Arrays.asList(clothes1, clothes2, clothes3));
        }
    }
}
