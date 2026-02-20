import { navigateTo } from "./router.js";
import { BASE_URL, fetchData, updateProductForm, updateUserForm } from "./util.js";

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
        } else if (confPassword.value !== password.value) {
            error = "Passwords don't match";
        }

        if (error !== "") {
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

export async function validateProduct(formInput, alertInput, productId = null) {
    const { name, price, description, size, color, category, image } = formInput.elements;

    const isUpdateMode = productId ? true : false;

    if (isUpdateMode) {
        const imagePreview = document.getElementById('image-preview');
        const product = await productData(productId);
        updateProductForm(formInput, product, imagePreview);
    }

    formInput.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace
        const formattedPrice = price.value.replace(/,/g, ".");
        const file = image.files[0];

        // Reset the label and error
        alertInput.textContent = "";
        let error = "";

        if (name.value === "") {
            error = "Name is required!";
        }
        else if (name.value.length < 3) {
            error = "Name is too short!";
        }
        else if (!nameRegex.test(name.value)) {
            error = "Name must not have numbers";
        }
        else if (price.value === "") {
            error = "Price is required!";
        }
        else if (isNaN(price.value)) {
            error = "Enter a valid price!";
        }
        else if (description.value === "") {
            error = "Description is required!";
        }
        else if (size.value === "") {
            error = "You must select a valid size!";
        }
        else if (color.value === "") {
            error = "You must select a valid color!";
        }
        else if (category.value === "") {
            error = "You must select a valid category!";
        }
        else if (isUpdateMode === false && image.files.length === 0) {
            error = "You must select an image";
        }
        else if (file && file.type !== "image/png") {
            error = "Only PNG images are allowed!";
        }

        if (error !== "") {
            alertInput.textContent = error;
            alertInput.scrollIntoView({ behavior: "smooth", block: "center" });
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
            await sendProductData(isUpdateMode, productData, file, alertInput, formInput, productId);
        }
    });
}

async function sendProductData(isUpdateMode, product, file, alert, form, productId) {
    try {
        //image upload
        if (file) {
            const imageFormData = new FormData();
            imageFormData.append('image', file);

            const imageResponse = await fetch(`${BASE_URL}/image`, {
                method: 'POST',
                body: imageFormData
            });
            if (!imageResponse.ok) throw new Error("Failed to upload image");

            const fileName = await imageResponse.text();

            product.imageData = {
                name: fileName.trim()
            }
        }
        const method = isUpdateMode ? 'PUT' : 'POST';
        const url = isUpdateMode ? `${BASE_URL}/clothes/${productId}` : `${BASE_URL}/clothes`;
        const productResponse = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (productResponse.ok) {
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
            alert.style.color = "green";
            alert.textContent = isUpdateMode ? "Product updated successfully!" : "Product created successfully!";
            if (isUpdateMode) {
                const imagePreview = document.getElementById('image-preview');
                const productInput = await productData(productId);
                updateProductForm(form, productInput, imagePreview);
            } else {
                form.reset();
            }

        } else {
            throw new Error(isUpdateMode ? "Failed to upload" : "Failed to create");
        }
    } catch (error) {
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
        alert.style.color = "red";
        alert.textContent = error.message;
    }
}

export async function validateCategory(form, nameInput, alert, categoryId = null) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace

        // Reset the label and error
        alert.textContent = "";
        let error = "";

        if (nameInput.value === "") {
            error = "Name is required!";
        } else if (nameInput.value.length < 3) {
            error = "Name is too short!";
        } else if (!nameRegex.test(nameInput.value)) {
            error = "Name must not have numbers";
        }

        if (error !== "") {
            alert.style.color = "red";
            alert.textContent = error;
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            const obj = {
                name: nameInput.value,
            };
            await sendCategoryData(obj, alert, form, categoryId);
        }
    });
}

export async function sendCategoryData(obj, alert, form, id) {
    const isUpdateMode = id ? true : false;
    const method = isUpdateMode ? 'PUT' : 'POST';
    const url = isUpdateMode ? `${BASE_URL}/category/${id}` : `${BASE_URL}/category`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })

        if (response.ok) {
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
            alert.style.color = "green";
            alert.textContent = isUpdateMode ? "Category updated successfully!" : "Category created successfully!";
            form.reset();
        } else {
            throw new Error(isUpdateMode ? "Failed to update" : "Failed to create");
        }
    } catch (error) {
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
        alert.style.color = "red";
        alert.textContent = error.message;
    }
}

async function productData(id) {
    const product = await fetchData(`${BASE_URL}/clothes/${id}`);
    return product;
}

export async function validateUser(formInput, alertInput, userId = null) {
    const { name, cpf, email, phone, password, confPassword, role } = formInput.elements;

    const isUpdateMode = userId ? true : false;

    if (isUpdateMode) {
        const user = await fetchData(`${BASE_URL}/users/${userId}`);
        updateUserForm(formInput, user);
    }

    formInput.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace
        const cpfRegex = /^[0-9]+$/; //alow only numbers
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //checks if string looks like a simple email: "text@text.text"
        const phoneRegex = /^[0-9]+$/; //alow only numbers

        // Reset the label and error
        alertInput.textContent = "";
        let error = "";

        if (name.value === "") {
            error = "Name is required!";
        }
        else if (name.value.length < 3) {
            error = "Name is too short!";
        }
        else if (!nameRegex.test(name.value)) {
            error = "Name must not have numbers";
        }
        else if (cpf.value === "") {
            error = "Cpf is required!";
        }
        else if (cpf.value.length < 11) {
            error = "Cpf must have 11 digits";
        }
        else if (!cpfRegex.test(cpf.value)) {
            error = "Cpf must have only numbers";
        }
        else if (email.value === "") {
            error = "Email is required!";
        }
        else if (!emailRegex.test(email.value)) {
            error = "Email is not valid!";
        }
        else if (phone.value === "") {
            error = "Phone is required!";
        }
        else if (phone.value.length < 11) {
            error = "Phone is too short";
        }
        else if (!phoneRegex.test(phone.value)) {
            error = "Phone must have only numbers";
        }
        else if (password.value === "") {
            error = "Password is required";
        }
        else if (password.value.length < 8) {
            error = "Password is too short (Minimum 8 digits)";
        }
        else if (!isUpdateMode && confPassword.value === "") {
            error = "The confirmation password is required!";
        }
        else if (!isUpdateMode && confPassword.value !== password.value) {
            error = "The passwords don't match!";
        }
        else if (role.value === "") {
            error = "You must select a valid role!";
        }

        if (error !== "") {
            alertInput.textContent = error;
            alertInput.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            const obj = {
                name: name.value,
                email: email.value,
                cpf: cpf.value,
                phone: phone.value,
                role: role.value
            };
            await sendUserData(obj, password, alertInput, formInput, userId);
        }
    });
}

export async function sendUserData(obj, password, alert, form, id) {
    const isUpdateMode = id ? true : false;
    const method = isUpdateMode ? 'PUT' : 'POST';
    const url = isUpdateMode ? `${BASE_URL}/users/${id}` : `${BASE_URL}/users`;

    try {
        if (isUpdateMode && password.value !== "") {
            const passwordResponse = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(password.value)
            });
            if (!passwordResponse.ok) throw new Error("Failed to update password");
        }

        if (!isUpdateMode) {
            obj.password = password.value;
        }
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })

        if (response.ok) {
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
            alert.style.color = "green";
            alert.textContent = isUpdateMode ? "User updated successfully!" : "User created successfully!";
            
            if (isUpdateMode) {
                const user = await fetchData(`${BASE_URL}/users/${id}`);
                updateUserForm(form, user);
            } else {
                form.reset();
            }

        } else {
            throw new Error(isUpdateMode ? "Failed to update" : "Failed to create");
        }
    } catch (error) {
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
        alert.style.color = "red";
        alert.textContent = error.message;
    }
}