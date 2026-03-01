import { navigateTo } from "./router.js";
import { BASE_URL, updateAlert } from "../utils/util.js";
import { authenticateUser, checkAuth } from "../services/auth.js";
import * as API from "../services/api.js";

export function validateCreateAccount() {
    const form = document.getElementById('form-create-account');
    const { name, cpf, email, phone, password, confPassword } = form.elements;
    const alert = document.getElementById('alert-create-account');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace
        const phoneRegex = /^\d{11}$/; //numeric number with 11 digits long
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //checks if string looks like a simple email: "text@text.text"
        const cpfRegex = /^[0-9]+$/; //alow only numbers

        // Reset the label and error
        alert.textContent = "";
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
            error = "CPF is required!";
        }
        else if (cpf.value.length < 11) {
            error = "CPF must have 11 digits";
        }
        else if (!cpfRegex.test(cpf.value)) {
            error = "CPF cannot have letters!";
        }
        else if (email.value === "") {
            error = "Email is required!";
        }
        else if (!emailRegex.test(email.value)) {
            error = "Please enter a valid email!";
        }
        else if (phone.value === "") {
            error = "Phone is required!";
        }
        else if (!phoneRegex.test(phone.value)) {
            error = "Please enter a valid phone with DDD (11 digits)!";
        }
        else if (password.value === "") {
            error = "Password is required!";
        }
        else if (password.value.length < 8) {
            error = "Password minimum size is 8";
        }
        else if (confPassword.value === "") {
            error = "Confirmation password is required!";
        }
        else if (confPassword.value !== password.value) {
            error = "Passwords don't match";
        }

        if (error !== "") {
            updateAlert(alert, error, "red");
        } else {
            const userData = {
                name: name.value,
                cpf: cpf.value,
                email: email.value,
                phone: phone.value,
                password: password.value,
                role: "USER"
            }
            await API.sendAccountData(userData, alert, form);
        }
    });
}

export async function validateProduct(form, alert, productId = null) {
    const { name, price, description, size, color, category, image } = form.elements;

    const isUpdateMode = productId ? true : false;

    if (isUpdateMode) {
        const imagePreview = document.getElementById('image-preview');
        const product = await API.fetchData(`${BASE_URL}/clothes/${productId}`)
        updateProductForm(form, product, imagePreview);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace
        const formattedPrice = price.value.replace(/,/g, ".");
        const file = image.files[0];

        // Reset the label and error
        alert.textContent = "";
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
            updateAlert(alert, error, "red");
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
            await API.sendProductData(isUpdateMode, productData, file, alert, form, productId);
        }
    });
}

export function updateProductForm(form, product, imagePreview) {
    const { name, price, description, size, color, category } = form.elements;
    name.value = product.name;
    price.value = product.price;
    description.value = product.description;
    size.value = product.size;
    color.value = product.color;
    category.value = product.category.id;
    imagePreview.src = `${BASE_URL}/image/${product.imageData.name}`;
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
            updateAlert(alert, error, "red");
        } else {
            const obj = {
                name: nameInput.value,
            };
            await API.sendCategoryData(obj, alert, form, categoryId);
        }
    });
}

export async function validateUser(form, alert, userId = null) {
    const { name, cpf, email, phone, password, confPassword, role } = form.elements;

    const isUpdateMode = userId ? true : false;

    if (isUpdateMode) {
        const user = await API.fetchData(`${BASE_URL}/users/${userId}`);
        updateUserForm(form, user);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace
        const cpfRegex = /^[0-9]+$/; //alow only numbers
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //checks if string looks like a simple email: "text@text.text"
        const phoneRegex = /^[0-9]+$/; //alow only numbers

        // Reset the label and error
        alert.textContent = "";
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
            updateAlert(alert, error, "red");
        } else {
            const obj = {
                name: name.value,
                email: email.value,
                cpf: cpf.value,
                phone: phone.value,
                role: role.value
            };
            await API.sendUserData(obj, password, alert, form, userId);
        }
    });
}

export function updateUserForm(form, user) {
    const { name, cpf, email, phone, password, role } = form.elements;
    name.value = user.name;
    cpf.value = user.cpf;
    email.value = user.email;
    phone.value = user.phone;
    password.value = user.password;
    role.value = user.role;
}

export async function validateLogin(form, alert) {
    const { email, password } = form.elements;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset the label and error
        alert.textContent = "";
        let error = "";

        if (email.value === "") {
            error = "Email is required!";
        }
        else if (password.value === "") {
            error = "Password is required";
        }

        if (error !== "") {
            updateAlert(alert, error, "red");
        } else {
            const obj = {
                email: email.value,
                password: password.value
            };
            try {
                const result = await authenticateUser(obj);

                alert.scrollIntoView({ behavior: "smooth", block: "center" });
                const text = result.data.toString();
                if (result.success) {
                    updateAlert(alert, text, "green");
                    setTimeout(() => {
                        navigateTo('/');
                    }, 3000);
                } else {
                    updateAlert(alert, text, "red");
                }
            } catch (error) {
                updateAlert(alert, error.message, "red");
            }
        }
    });
}

export async function validateOrder(alert) {
    const user = await checkAuth();
    if (!user) {
        updateAlert(alert, "You're not logged in! Redirecting to login...", "red");
        setTimeout(() => {
            navigateTo('/login');
        }, 3000);
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        return updateAlert(alert, "Your cart is empty!", "red");
    }

    try {
        const allItems = await Promise.all(
            cart.map(async (item) => {
                const productData = await API.fetchData(`${BASE_URL}/clothes/${item.id}`);
                if (!productData) throw new Error(`Product ${item.id} not found`);
                return { quantity: item.quantity, price: productData.price, clothes: { id: productData.id } }
            })
        );

        const orderObj = {
            orderStatus: "PAID",
            client: { id: user.id },
            items: allItems,
            payment: {}
        };
        const success = await API.fetchOrder(orderObj);
        if (success) {
            updateAlert(alert, "Your order has been created successfully!", "green");
            localStorage.removeItem('cart');
            setTimeout(() => {
                navigateTo('/');
            }, 3000);

        } else {
            updateAlert(alert, "Failed to create your order!", "red");
        }
    } catch (error) {
        updateAlert(alert, "An error ocurred while processing your items", "red");
    }
}