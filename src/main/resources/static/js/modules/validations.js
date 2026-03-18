import { navigateTo } from "./router.js";
import { BASE_URL, updateAlert, renderSelectedItems, bindOrderEvents, bindSelectedItemsEvent } from "../utils/util.js";
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
        const cpfRegex = /^[0-9]+$/; //allow only numbers

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
        else if (cpf.value.length !== 11) {
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

export async function validateCategory(categoryId = null) {
    const form = document.querySelector('.category-form');
    const nameInput = document.querySelector('.category-input');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Allow normal characters, accented characters and whitespace
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;

        if (nameInput.value === "") {
            updateAlert("Name is required", "red");
        }
        else if (nameInput.value.length < 3) {
            updateAlert("Name is too short", "red");
        }
        else if (!nameRegex.test(nameInput.value)) {
            updateAlert("Name must not have numbers", "red");
        }
        else {
            const categoryObj = {
                name: nameInput.value,
            };
            const response = await API.sendCategoryData(categoryObj, categoryId);
            if (response.success === true) {
                updateAlert(response.message, "green");
                setTimeout(() => {
                    navigateTo('/admin/categories');
                }, 2000);
            } else {
                updateAlert(response.message, "red");
            }
        }
    });
}

export async function validateUser(userId = null) {
    const form = document.querySelector('.users-form');

    const { name, cpf, email, phone, password, confPassword, role } = form.elements;

    const isUpdateMode = userId ? true : false;

    if (isUpdateMode) {
        // Show user data in form
        const user = await API.fetchData(`${BASE_URL}/api/admin/users/${userId}`);
        updateUserForm(form, user);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Allow normal characters, accented characters and whitespace
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
        // Allow only numbers
        const numberRegex = /^[0-9]+$/;
        // Checks if string looks like a simple email: "text@text.text"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name.value === "") {
            updateAlert("Name is required", "red");
        }
        else if (name.value.length < 3) {
            updateAlert("Name is too short", "red");
        }
        else if (!nameRegex.test(name.value)) {
            updateAlert("Name must not have numbers", "red");
        }
        else if (cpf.value === "") {
            updateAlert("Cpf is required", "red");
        }
        else if (cpf.value.length !== 11) {
            updateAlert("Cpf must have 11 digits", "red");
        }
        else if (!numberRegex.test(cpf.value)) {
            updateAlert("Cpf must have only numbers", "red");
        }
        else if (email.value === "") {
            updateAlert("Email is required", "red");
        }
        else if (!emailRegex.test(email.value)) {
            updateAlert("Email is not valid", "red");
        }
        else if (phone.value === "") {
            updateAlert("Phone is required", "red");
        }
        else if (phone.value.length !== 11) {
            updateAlert("Phone is too short", "red");
        }
        else if (!numberRegex.test(phone.value)) {
            updateAlert("Phone must have only numbers", "red");
        }
        else if (!isUpdateMode && password.value === "") {
            updateAlert("Password is required", "red");
        }
        else if ((isUpdateMode && password.value !== "" && password.value.trim().length < 8) || (!isUpdateMode && password.value.length < 8)) {
            updateAlert("Password is too short (Minimum 8 digits)", "red");
        }
        else if (!isUpdateMode && confPassword.value === "") {
            updateAlert("The confirmation password is required!", "red");
        }
        else if (!isUpdateMode && confPassword.value !== password.value) {
            updateAlert("The passwords don't match!", "red");
        }
        else if (role.value === "") {
            updateAlert("You must select a valid role", "red");
        }
        else {
            const userObj = {
                name: name.value,
                email: email.value,
                cpf: cpf.value,
                phone: phone.value,
                role: role.value
            };
            
            const response = await API.sendUserData(userObj, password, userId);
            if (response.success === true) {
                updateAlert(response.message, "green");
                setTimeout(() => {
                    navigateTo('/admin/users');
                }, 1000);
            } else {
                updateAlert(response.message, "red");
            }
        }
    });
}

export function updateUserForm(form, user) {
    const { name, cpf, email, phone, role } = form.elements;
    name.value = user.name;
    cpf.value = user.cpf;
    email.value = user.email;
    phone.value = user.phone;
    role.value = user.role;
}

export async function validateLogin() {
    const form = document.querySelector('.login-form');
    const { email, password } = form.elements;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (email.value === "") {
            updateAlert("Email is required", "red");
        }
        else if (password.value === "") {
            updateAlert("Password is required", "red");
        }
        else {
            const loginObj = {
                email: email.value,
                password: password.value
            };

            const response = await authenticateUser(loginObj);
            if (response.success === true) {
                updateAlert(response.message, "green");
                setTimeout(() => {
                    navigateTo('/');
                }, 1000);
            } else {
                updateAlert(response.message, "red");
            }
        }
    });
}

export async function validateAdminOrder(alert, form, id = null) {
    const { userId, orderStatus } = form.elements;
    const orderItems = JSON.parse(sessionStorage.getItem('orderItems')) || [];

    const isUpdateMode = id ? true : false;

    const userRegex = /^[0-9]+$/; //allow only numbers

    if (userId.value === "" || !userRegex.test(userId.value)) {
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
        updateAlert(alert, "Provide a valid user ID!", "red");
    }
    else if (orderItems.length === 0) {
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
        updateAlert(alert, "Order cannot have empty products!", "red")
    }
    else if (orderStatus.value === "") {
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
        updateAlert(alert, "You must select a valid order status!", "red");
    }
    else {
        try {
            const allItems = orderItems.map((item) => ({
                quantity: item.quantity,
                clothes: { id: item.id }
            }));

            const orderObj = {
                orderStatus: orderStatus.value,
                client: { id: Number(userId.value) },
                items: allItems,
                payment: {}
            };

            if (isUpdateMode) {
                orderObj.id = Number(id);
            }

            const success = isUpdateMode ? await API.putOrder(orderObj)
                : await API.postOrder(orderObj);

            if (success) {
                updateAlert(alert, "Your order has been created successfully!", "green");
                sessionStorage.removeItem('orderItems');
                setTimeout(() => {
                    navigateTo('/admin/orders');
                }, 3000);

            } else {
                updateAlert(alert, "Failed to create your order!", "red");
            }
        } catch (error) {
            updateAlert(alert, "An error ocurred while processing your items", "red");
        }
    }
}

export async function updateOrderForm(form, order) {
    const { userId, orderStatus } = form.elements;

    userId.value = order.client.id;
    orderStatus.value = order.orderStatus;

    const allItems = order.items.map((item) => ({
        id: item.clothes.id,
        name: item.clothes.name,
        price: item.price * 100, //price is multiplied by 100 because it will be divided by 100 when rendered
        quantity: item.quantity,
    }));

    sessionStorage.setItem('orderItems', JSON.stringify(allItems));
}

export async function validateUserOrder(alert) {
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
        const allItems = cart.map((item) => ({
            quantity: item.quantity,
            clothes: { id: item.id }
        }));

        const orderObj = {
            orderStatus: "PAID",
            client: { id: Number(user.id) },
            items: allItems,
            payment: {}
        };
        const success = await API.postOrder(orderObj);
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
        updateAlert(alert, "An error occurred while processing your items", "red");
    }
}

export async function validateProfileData(form, alert, userId) {
    const { name, cpf, email, phone } = form.elements;

    const user = await API.fetchData(`${BASE_URL}/users/${userId}`);
    const role = user.role;

    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace
    const cpfRegex = /^[0-9]+$/; //allow only numbers
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //checks if string looks like a simple email: "text@text.text"
    const phoneRegex = /^[0-9]+$/; //allow only numbers

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
    else if (cpf.value.length !== 11) {
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

    if (error !== "") {
        updateAlert(alert, error, "red");
        return;
    }

    const obj = {
        name: name.value,
        email: email.value,
        cpf: cpf.value,
        phone: phone.value,
        role: role
    };

    const response = await API.putUser(obj, userId);

    if (response === true) {
        updateAlert(alert, "Updated successfully!", "green");
        setTimeout(() => {
            const configElement = document.getElementById('profile-option');
            configElement.innerHTML = `<h1>Select an option</h1>`;
        }, 2000);

        // disable the inputs
        const inputs = form.querySelectorAll('.profile-box-input');
        inputs.forEach(input => input.disabled = true);

        // buttons back to original state
        document.getElementById('update-profile').style.display = "block";
        document.getElementById('cancel-update-profile').style.display = "none";
        document.getElementById('update-profile-button').style.display = "none";
    } else {
        updateAlert(alert, response.message, "red");
    }
}

export function validateProfilePassword(userId) {
    const currentPasswordButton = document.getElementById('profile-current-password-button');

    const alert = document.getElementById('profile-password-alert');
    const form = document.getElementById('profile-update-password-form');

    const updatePasswordElement = document.getElementById("profile-update-password-div");
    const currentPasswordElement = document.getElementById("profile-current-password-div");

    const currentPasswordInput = document.getElementById('profile-current-password-input');
    const newPasswordInput = document.getElementById('profile-new-password-input');
    const confirmPasswordInput = document.getElementById('profile-confirm-password-input');

    currentPasswordButton.addEventListener('click', async () => {
        const passwordValue = currentPasswordInput.value;

        if (!passwordValue) {
            updateAlert(alert, "Enter your current password", "red");
        } else {
            const response = await API.checkUserPassword(userId, passwordValue);
            if (response.success === true) {
                updateAlert(alert, response.message, "green");
                currentPasswordElement.style.display = "none";
                updatePasswordElement.style.display = "flex";
            } else {
                updateAlert(alert, response.message, "red");
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const passwordValue = newPasswordInput.value;
        const confirmPasswordValue = confirmPasswordInput.value;

        if (!passwordValue) {
            updateAlert(alert, "Password is required", "red");
        }
        else if (passwordValue.length < 8) {
            updateAlert(alert, "Password is too short (Minimum 8 digits)", "red");
        }
        else if (!confirmPasswordValue) {
            updateAlert(alert, "The confirmation password is required!", "red");
        }
        else if (confirmPasswordValue !== passwordValue) {
            updateAlert(alert, "The passwords don't match!", "red");
        } else {
            const response = await API.sendUserPassword(userId, passwordValue);

            if (response.success === true) {
                updateAlert(alert, response.message, "green");
                setTimeout(() => {
                    const configElement = document.getElementById('profile-option');
                    configElement.innerHTML = `<h1>Select an option</h1>`;
                }, 2000);
            } else {
                updateAlert(alert, response.message, "red");
            }
        }
    });
}