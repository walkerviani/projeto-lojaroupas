import { navigateTo } from "./router.js";
import { BASE_URL, updateAlert } from "../utils/util.js";
import { authenticateUser, checkAuth } from "../services/auth.js";
import * as API from "../services/api.js";

export function validateCreateAccount() {
    const form = document.getElementById('form-create-account');
    const { name, cpf, email, phone, password, confPassword } = form.elements;

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
            updateAlert("CPF is required", "red");
        }
        else if (cpf.value.length !== 11) {
            updateAlert("CPF must have 11 digits", "red");
        }
        else if (!numberRegex.test(cpf.value)) {
            updateAlert("CPF cannot have letters", "red");
        }
        else if (email.value === "") {
            updateAlert("Email is required", "red");
        }
        else if (!emailRegex.test(email.value)) {
            updateAlert("Please enter a valid email", "red");
        }
        else if (phone.value === "") {
            updateAlert("Phone is required", "red");
        }
        else if (!numberRegex.test(phone.value)) {
            updateAlert("Please enter a valid phone with DDD (11 digits)", "red");
        }
        else if (password.value === "") {
            updateAlert("Password is required", "red");
        }
        else if (password.value.length < 8) {
            updateAlert("Password minimum size is 8", "red");
        }
        else if (confPassword.value === "") {
            updateAlert("Confirmation password is required", "red");
        }
        else if (confPassword.value !== password.value) {
            updateAlert("Passwords don't match", "red");
        }
        else {
            const userData = {
                name: name.value,
                cpf: cpf.value,
                email: email.value,
                phone: phone.value,
                password: password.value,
                role: "USER"
            }
            const response = await API.sendAccountData(userData);
            if (response.success) {
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

export async function validateProduct(productId = null) {
    const form = document.querySelector('.products-form');
    const { name, price, description, size, color, category, image } = form.elements;
    const isUpdateMode = productId != null;

    if (isUpdateMode) {
        const product = await API.fetchData(`${BASE_URL}/api/clothes/${productId}`)
        updateProductForm(form, product);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Allow normal and accented characters and whitespace
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
        // Replace commas with dots in price value
        const formattedPrice = price.value.replace(/,/g, ".");
        // Get the selected file from input
        const file = image.files[0];

        if (name.value.trim() === "") {
            updateAlert("Name is required", "red");
        }
        else if (name.value.length < 3) {
            updateAlert("Name is too short (Min. 3 characters)", "red");
        }
        else if (!nameRegex.test(name.value)) {
            updateAlert("Name must not have numbers", "red");
        }
        else if (formattedPrice.trim() === "") {
            updateAlert("Price is required", "red");
        }
        else if (isNaN(formattedPrice)) {
            updateAlert("Enter a valid price", "red");
        }
        else if (description.value.trim() === "") {
            updateAlert("Description is required", "red");
        }
        else if (size.value === "") {
            updateAlert("You must select a valid size", "red");
        }
        else if (color.value === "") {
            updateAlert("You must select a valid color", "red");
        }
        else if (category.value === "") {
            updateAlert("You must select a valid category", "red");
        }
        else if (!isUpdateMode && image.files.length === 0) {
            updateAlert("You must select an image", "red");
        }
        else if (file && file.type !== "image/png") {
            updateAlert("Only PNG images are allowed", "red");
        }
        else {
            const productObj = {
                name: name.value,
                price: Number(formattedPrice),
                description: description.value,
                size: size.value,
                color: color.value,
                category: {
                    id: Number(category.value)
                }
            };
            const response = await API.sendProductData(productObj, file, productId);
            if (response.success) {
                updateAlert(response.message, "green");
                setTimeout(() => {
                    navigateTo('/admin/products');
                }, 2000);
            } else {
                updateAlert(response.message, "red");
            }
        }
    });
}

export function updateProductForm(form, product) {
    const imagePreview = document.getElementById('image-preview');
    const { name, price, description, size, color, category } = form.elements;
    name.value = product.name;
    price.value = product.price;
    description.value = product.description;
    size.value = product.size;
    color.value = product.color;
    category.value = product.category.id;
    imagePreview.src = `${BASE_URL}/api/image/${product.imageData.name}`;
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
            if (response.success) {
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
            if (response.success) {
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
            if (response.success) {
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

export async function validateAdminOrder(form, orderId = null) {
    const { userId, orderStatus } = form.elements;
    const orderItems = JSON.parse(sessionStorage.getItem('orderItems')) || [];

    const isUpdateMode = orderId != null;

    // Allow only numbers
    const numberRegex = /^[0-9]+$/;

    if (userId.value.trim() === "" || !numberRegex.test(userId.value)) {
        updateAlert("Provide a valid user ID", "red");
    }
    else if (orderItems.length === 0) {
        updateAlert("Order cannot have empty products", "red")
    }
    else if (orderStatus.value.trim() === "") {
        updateAlert("You must select a valid order status", "red");
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
            };

            const response = isUpdateMode ? await API.sendOrderData(orderObj, Number(orderId))
                : await API.sendOrderData(orderObj);

            if (response.success) {
                updateAlert(response.message, "green");
                sessionStorage.removeItem('orderItems');
                setTimeout(() => {
                    navigateTo('/admin/orders');
                }, 3000);

            } else {
                updateAlert(response.message, "red");
            }
        } catch (error) {
            updateAlert(error.message, "red");
        }
    }
}

// Show user items
export async function updateOrderForm(form, order) {
    const { userId, orderStatus } = form.elements;

    userId.value = order.client.id;
    orderStatus.value = order.orderStatus;

    const allItems = order.items.map((item) => ({
        id: item.clothes.id,
        name: item.clothes.name,
        price: item.price * 100, // Price is multiplied by 100 because will be divided by 100 when rendered
        quantity: item.quantity,
    }));

    sessionStorage.setItem('orderItems', JSON.stringify(allItems));
}

export async function validateUserOrder() {
    const user = await checkAuth();
    if (!user) {
        updateAlert("You're not logged in! Redirecting to login...", "red");
        setTimeout(() => {
            navigateTo('/login');
        }, 3000);
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        return updateAlert("Your cart is empty!", "red");
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
        };
        const response = await API.sendOrderData(orderObj);
        if (response.success) {
            updateAlert("Your order has been created successfully!", "green");
            localStorage.removeItem('cart');
            setTimeout(() => {
                navigateTo('/');
            }, 3000);
        } else {
            updateAlert("Failed to create your order!", "red");
        }
    } catch (error) {
        updateAlert("An error occurred while processing your items", "red");
    }
}

// Validate user account data
export async function validateProfileData(userId) {
    const form = document.getElementById('form-update-profile');
    const { name, cpf, email, phone } = form.elements;

    // Allow normal and accented characters and whitespace
    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    // Allow only numbers
    const numberRegex = /^[0-9]+$/;
    // Checks if string looks like a simple email: "text@text.text"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.value.trim() === "") {
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
    else if (phone.value.length < 11) {
        updateAlert("Phone is too short", "red");
    }
    else if (!numberRegex.test(phone.value)) {
        updateAlert("Phone must have only numbers", "red");
    }
    else {
        const userObj = {
            name: name.value,
            email: email.value,
            cpf: cpf.value,
            phone: phone.value
        };

        const response = await API.sendUserData(userObj, null, userId);

        if (response.success) {
            updateAlert("Updated successfully!", "green");
            // Close 'Account Settings' page
            setTimeout(() => {
                const configElement = document.getElementById('profile-option');
                configElement.innerHTML = `<h1>Select an option</h1>`;
            }, 2000);

            // Disable the inputs
            const inputs = form.querySelectorAll('.profile-box-input');
            inputs.forEach(input => input.disabled = true);

            // Set buttons back to original state
            document.getElementById('update-profile').style.display = "block";
            document.getElementById('cancel-update-profile').style.display = "none";
            document.getElementById('update-profile-button').style.display = "none";
        } else {
            updateAlert(response.message, "red");
        }
    }
}

// Handle "Change Password" in the user profile
export function validateProfilePassword(userId) {
    // Button to verify the current password
    const currentPasswordButton = document.getElementById('profile-current-password-button');
    // Container for updating the password
    const updatePasswordElement = document.getElementById("profile-update-password-div");
    // Container for entering the current password
    const currentPasswordElement = document.getElementById("profile-current-password-div");
    // Current password input
    const currentPasswordInput = document.getElementById('profile-current-password-input');

    currentPasswordButton.addEventListener('click', async () => {
        const passwordValue = currentPasswordInput.value.trim();

        if (!passwordValue) {
            updateAlert("Enter your current password", "red");
        } else {
            const response = await API.checkUserPassword(userId, passwordValue);
            if (response.success) {
                updateAlert(response.message, "green");

                // Hide current password step and show update password form
                currentPasswordElement.style.display = "none";
                updatePasswordElement.style.display = "flex";
            } else {
                updateAlert(response.message, "red");
            }
        }
    });
    validateUserUpdatePassword(userId);
}

function validateUserUpdatePassword(userId) {
    const form = document.getElementById('profile-update-password-form');
    // Input field used to confirm the new password
    const confirmPasswordInput = document.getElementById('profile-confirm-password-input');
    // Input field used to enter the new password
    const newPasswordInput = document.getElementById('profile-new-password-input');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const passwordValue = newPasswordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();

        if (!passwordValue) {
            updateAlert("Password is required", "red");
        }
        else if (passwordValue.length < 8) {
            updateAlert("Password is too short (Minimum 8 characters)", "red");
        }
        else if (!confirmPasswordValue) {
            updateAlert("The confirmation password is required!", "red");
        }
        else if (confirmPasswordValue !== passwordValue) {
            updateAlert("The passwords don't match!", "red");
        } else {
            const response = await API.sendUserPassword(userId, passwordValue);

            if (response.success) {
                updateAlert(response.message, "green");

                setTimeout(() => {
                    const configElement = document.getElementById('profile-option');
                    configElement.innerHTML = `<h1>Select an option</h1>`;
                }, 2000);

            } else {
                updateAlert(response.message, "red");
            }
        }
    });
}