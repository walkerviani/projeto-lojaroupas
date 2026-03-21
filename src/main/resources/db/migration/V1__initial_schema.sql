CREATE TABLE `category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `image_data` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `imagedata` MEDIUMBLOB DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7r80bqcycripg6994yi7vntjo` (`name`)
);

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cpf` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7kqluf7wl0oxs7n90fpya03ss` (`cpf`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
);

CREATE TABLE `clothes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `color` enum('BEIGE','BLACK','BLUE','BROWN','GREEN','GREY','ORANGE','PURPLE','RED','WHITE','YELLOW') DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `size` enum('LARGE','MEDIUM','SMALL') DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `image_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKil1bfng6y1sk6op4l08k230tf` (`image_id`),
  KEY `FKhuemmmxpg0baj2dfbhslojm85` (`category_id`),
  CONSTRAINT `FKc3pf3qci4rdl60jlg3o43xt04` FOREIGN KEY (`image_id`) REFERENCES `image_data` (`id`),
  CONSTRAINT `FKhuemmmxpg0baj2dfbhslojm85` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
);

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `moment` datetime(6) DEFAULT NULL,
  `order_status` tinyint(4) DEFAULT NULL,
  `id_client` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKn4qxs7ywxnvaji059wj2065wm` (`id_client`),
  CONSTRAINT `FKn4qxs7ywxnvaji059wj2065wm` FOREIGN KEY (`id_client`) REFERENCES `users` (`id`)
);

CREATE TABLE `order_item` (
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `clothes_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  PRIMARY KEY (`clothes_id`,`order_id`),
  KEY `FKt4dc2r9nbvbujrljv3e23iibt` (`order_id`),
  CONSTRAINT `FK7ufvl1dwcb5wjydxkk7evscul` FOREIGN KEY (`clothes_id`) REFERENCES `clothes` (`id`),
  CONSTRAINT `FKt4dc2r9nbvbujrljv3e23iibt` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
);

CREATE TABLE `payments` (
  `moment` datetime(6) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL,
  PRIMARY KEY (`order_id`),
  CONSTRAINT `FK81gagumt0r8y3rmudcgpbk42l` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
);








