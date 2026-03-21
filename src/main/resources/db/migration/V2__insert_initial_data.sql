-- Categories
INSERT INTO category (name) VALUES ('Shirt');
INSERT INTO category (name) VALUES ('Skirt');
INSERT INTO category (name) VALUES ('Coat');
INSERT INTO category (name) VALUES ('Pants');

-- Users

/* 
Password hashed with BCrypt. 
Original value: 12345678
User role: ADMIN
*/
INSERT INTO users (cpf, email, name, password, phone, role) 
VALUES ('18273849374', 'admin@gmail.com', 'Admin', 
'$2a$10$wH7o6Gqz0jJqQ0lYpFZqG.9rYvZqXz8X7r2H8QnYp0rVY9mZ8Gx6a', 
'10244333522', 'ADMIN');

/* 
Password hashed with BCrypt. 
Original value: 87654321
User role: USER
*/
INSERT INTO users (cpf, email, name, password, phone, role) 
VALUES ('38492837434', 'mariah@gmail.com', 'Mariah', 
'$2a$10$8K1pQyYxX9Kjz9s7G5Z1hO3KZ0wZ6Y8yXcKf3dF1QjR9L0mN2pQ6u', 
'19454235413', 'USER');