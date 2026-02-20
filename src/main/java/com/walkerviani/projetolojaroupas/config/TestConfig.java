package com.walkerviani.projetolojaroupas.config;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;

import com.walkerviani.projetolojaroupas.entities.Category;
import com.walkerviani.projetolojaroupas.entities.Clothes;
import com.walkerviani.projetolojaroupas.entities.ImageData;
import com.walkerviani.projetolojaroupas.entities.Order;
import com.walkerviani.projetolojaroupas.entities.OrderItem;
import com.walkerviani.projetolojaroupas.entities.Payment;
import com.walkerviani.projetolojaroupas.entities.User;
import com.walkerviani.projetolojaroupas.entities.enums.Color;
import com.walkerviani.projetolojaroupas.entities.enums.OrderStatus;
import com.walkerviani.projetolojaroupas.entities.enums.Role;
import com.walkerviani.projetolojaroupas.entities.enums.Size;
import com.walkerviani.projetolojaroupas.repositories.CategoryRepository;
import com.walkerviani.projetolojaroupas.repositories.ClothesRepository;
import com.walkerviani.projetolojaroupas.repositories.OrderItemRepository;
import com.walkerviani.projetolojaroupas.repositories.OrderRepository;
import com.walkerviani.projetolojaroupas.repositories.UserRepository;
import com.walkerviani.projetolojaroupas.util.ImageUtils;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {

    @Autowired
    private ClothesRepository clothesRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public void run(String... args) throws Exception {

        Category cat1 = new Category("Shirt");
        Category cat2 = new Category("Skirt");
        Category cat3 = new Category("Coat");
        categoryRepository.saveAll(Arrays.asList(cat1, cat2, cat3));

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
                Size.MEDIUM, cat1, Color.RED);
        Clothes clothes2 = new Clothes("Black Skirt", new BigDecimal("12.42"), "45% Cotton, 55% Polyester",
                img2, Size.SMALL, cat2, Color.BLACK);
        Clothes clothes3 = new Clothes("Blue Coat", new BigDecimal("45.43"), "90% Cotton, 10% wool",
                img3, Size.LARGE, cat3, Color.BLUE);
        clothesRepository.saveAll(Arrays.asList(clothes1, clothes2, clothes3));

        User u1 = new User("Carl", "carl@gmail.com", "18273849374", "53857495334", "10244333522", Role.USER);
        User u2 = new User("Mariah", "mariah@gmail.com", "38492837434", "r2jdfsi3", "19454235413", Role.ADMIN);
        userRepository.saveAll(Arrays.asList(u1, u2));

        Order ord1 = new Order(Instant.now(), OrderStatus.PAID, u1);
        Order ord2 = new Order(Instant.parse("2026-01-03T19:53:07Z"), OrderStatus.WAITING_PAYMENT, u2);
        orderRepository.saveAll(Arrays.asList(ord1, ord2));

        OrderItem orderItem1 = new OrderItem(ord1, clothes1, 5, clothes1.getPrice());
        OrderItem orderItem2 = new OrderItem(ord2, clothes2, 2, clothes2.getPrice());
        OrderItem orderItem3 = new OrderItem(ord2, clothes3, 1, clothes3.getPrice());
        orderItemRepository.saveAll(Arrays.asList(orderItem1, orderItem2, orderItem3));

        Payment pay1 = new Payment(Instant.parse("2026-01-03T19:53:07Z"), ord2);
        ord2.setPayment(pay1);

        Payment pay2 = new Payment(Instant.now(), ord1);
        ord1.setPayment(pay2);

        orderRepository.saveAll(Arrays.asList(ord1, ord2));
    }
}
