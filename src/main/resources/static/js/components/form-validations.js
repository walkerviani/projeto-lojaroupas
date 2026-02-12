import { navigateTo } from "./router.js";
import { BASE_URL } from "./util.js";

export function validateCreateAccount() {
    const form = document.getElementById('form-create-account');
    const { name, cpf, email, phone, password, confPassword } = form.elements;
    const alert = document.getElementById('alert-create-account');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace
        const phoneRegex = /^\d{11}$/; //numeric number with 11 digits long

        // Reset the label and error
        alert.textContent = "";
        let error = "";

        if (name.validity.valueMissing) { // Name validation
            error = "Name is required!";
        } else if (name.validity.tooShort) {
            error = "Name is too short!";
        } else if (!nameRegex.test(name.value)) {
            error = "Name must not have numbers";
        } else if (cpf.validity.valueMissing) { // Cpf validation
            error = "CPF is required!";
        } else if (cpf.value.trim().length < 11) {
            error = "CPF must have 11 digits";
        } else if (email.validity.valueMissing) { // Email validation
            error = "Email is required!";
        } else if (email.validity.typeMismatch) {
            error = "Please enter a valid email!";
        } else if (phone.validity.valueMissing) { // Phone validation
            error = "Phone is required!";
        } else if (!phoneRegex.test(phone.value)) {
            error = "Please enter a valid phone with DDD (11 digits)!";
        } else if (password.validity.valueMissing) { // Password validation
            error = "Password is required!";
        } else if (password.validity.tooShort) {
            error = "Password minimum size is 8";
        } else if (confPassword.validity.valueMissing) { // ConfPassword validation
            error = "Confirmation password is required!";
        } else if (confPassword.value != password.value) {
            error = "Passwords don't match";
        }

        if (error != "") {
            alert.textContent = error;
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            const userData = {
                name: name.value,
                cpf: cpf.value,
                email: email.value,
                phone: phone.value,
                password: password.value,
                role: "USER"
            }
            await sendAccountData(userData, alert, form);
        }
    });
}

async function sendAccountData(userData, alert, form) {
    try {
        alert.style.color = "blue";
        alert.textContent = "Creating account...";
        alert.scrollIntoView({ behavior: "smooth", block: "center" });

        const response = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert.style.color = "green";
            alert.textContent = "Account created successfully!";
            form.reset();
            setTimeout(() => navigateTo('/login'), 2000);
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error creating user. Check if your data already exists");
        }
    } catch (e) {
        console.error("Error: ", e);
        alert.style.color = "red";
        alert.textContent = e.message;
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

export function validateCreateProducts() {
    const form = document.getElementById('form-create-product');
    const { name, price, description, size, color, category, image } = form.elements;
    const alert = document.getElementById('alert-create-product');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace
        const formattedPrice = price.value.replace(/,/g, ".");
        const file = image.files[0];

        // Reset the label and error
        alert.textContent = "";
        let error = "";
        if (name.validity.valueMissing) {
            error = "Name is required!";
        } else if (name.validity.tooShort) {
            error = "Name is too short!";
        } else if (!nameRegex.test(name.value)) {
            error = "Name must not have numbers";
        } else if (price.validity.valueMissing) {
            error = "Price is required!";
        } else if (isNaN(price.value)) {
            error = "Enter a valid price!";
        } else if (description.validity.valueMissing) {
            error = "Description is required!";
        } else if (size.value === "") {
            error = "You must select a valid size!";
        } else if (color.value === "") {
            error = "You must select a valid color!";
        } else if (category.value === "") {
            error = "You must select a valid category!";
        } else if (image.validity.valueMissing) {
            error = "You must select an image";
        } else if (file && file.type !== "image/png") {
            error = "Only PNG images are allowed!";
        }

        if (error != "") {
            alert.textContent = error;
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            const productData = {
                name: name.value,
                price: formattedPrice,
                description: description.value,
                size: size.value,
                color: color.value,
                category: {
                    id: category.value
                }
            };
            await sendProductData(productData, file, alert, form);
        }
    });
}

async function sendProductData(productData, file, alert, form) {
    try {
        //image upload
        const imageFormData = new FormData();
        imageFormData.append('image', file);

        const imageResponse = await fetch(`${BASE_URL}/image`, {
            method: 'POST',
            body: imageFormData
        });

        if (!imageResponse.ok) throw new Error("Failed to upload image");
        
        const fileName = await imageResponse.text();
        
        productData.imageData = {
            name: fileName.trim()
        }

        const productResponse = await fetch(`${BASE_URL}/clothes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (productResponse.ok) {
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
            alert.style.color = "green";
            alert.textContent = "Product created successfully!";
            form.reset();
        } else {
            throw new Error("Failed to create");
        }
    } catch (error) {
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
        alert.style.color = "red";
        alert.textContent = error.message;
    }
}

export function validateCreateCategories() {
    const form = document.getElementById('form-create-category');
    const name = document.getElementById('name-create-category');
    const alert = document.getElementById('alert-create-categ');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace

        // Reset the label and error
        alert.textContent = "";
        let error = "";

        if (name.validity.valueMissing) {
            error = "Name is required!";
        } else if (name.validity.tooShort) {
            error = "Name is too short!";
        } else if (!nameRegex.test(name.value)) {
            error = "Name must not have numbers";
        }

        if (error != "") {
            alert.style.color = "red";
            alert.textContent = error;
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            const categoryData = {
                name: name.value,
                
            };
            await sendCategoryData(categoryData, alert, form);
        }
    });
}

async function sendCategoryData(categoryData, alert, form) {
    try {
        const categoryResponse = await fetch(`${BASE_URL}/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        if (categoryResponse.ok) {
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
            alert.style.color = "green";
            alert.textContent = "Category created successfully!";
            form.reset();
        } else {
            throw new Error("Failed to create");
        }
    } catch (error) {
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
        alert.style.color = "red";
        alert.textContent = error.message;
    }
}