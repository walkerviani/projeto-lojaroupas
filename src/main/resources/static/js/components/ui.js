import { navigateTo } from "../modules/router.js";
import * as UTIL from "../utils/util.js";
import * as VALIDATION from "../modules/validations.js";
import * as CART from "../modules/cart.js";
import * as API from "../services/api.js";
import * as AUTH from "../services/auth.js";

export function showProductsCard(products) {
    const container = document.getElementById('container');
    container.innerHTML = "";

    if (!products || products.length === 0) {
        container.innerHTML = "<p>No products found</p>";
        return;
    }
    products.forEach(product => {
        const imageUrl = product.imageData
            ? `${UTIL.BASE_URL}/image/${product.imageData.name}`
            : 'https://placehold.co/400x400?text=No+Image';

        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
        <div class="product-info">
            <div class="product-img" id="card">
                <img src="${imageUrl}">
            </div>
            <div class="product-info-text">
                <h3>${product.name}</h3>
                <p>${UTIL.currencyFormatterToBRL(product.price)}</p>
            </div>
        </div>
            `;
        card.addEventListener('click', () => navigateTo(`/product?id=${product.id}`));
        container.appendChild(card);
    });
}

export async function loadIndex() {
    const params = new URLSearchParams(window.location.search);

    const name = params.get('name');
    const category = params.get('category');

    let products;

    if (name) {
        products = await UTIL.getParams('name', (param) => API.fetchData(`${UTIL.BASE_URL}/clothes/name?name=${param}`));
    }
    else if (category) {
        products = await UTIL.getParams('category', (param) => API.fetchData(`${UTIL.BASE_URL}/clothes/category?category=${param}`));
    }
    else {
        products = await API.fetchData(`${UTIL.BASE_URL}/clothes`);
    }
    showProductsCard(products);
}

export async function showProductDetail() {
    loadContainer('template-detail', 'container detail-mode');

    const product = await UTIL.getParams('id', (param) => API.fetchData(`${UTIL.BASE_URL}/clothes/${param}`));
    const imageUrl = product.imageData ? `${UTIL.BASE_URL}/image/${product.imageData.name}` : 'https://placehold.co/400x400?text=No+Image';

    let img = document.getElementById('product-img');
    img.src = imageUrl;

    let title = document.getElementById('product-title');
    title.textContent = product.name;

    let price = document.getElementById('product-price');
    price.textContent = UTIL.currencyFormatterToBRL(product.price);

    let color = document.getElementById('product-color');
    color.textContent = "Color: " + UTIL.capitalizeFirstLetter(product.color);

    let description = document.getElementById('product-description');
    description.textContent = "Description: " + product.description;

    let size = document.getElementById('product-size');
    size.textContent = "Size: " + UTIL.capitalizeFirstLetter(product.size);

    const quantityInput = document.getElementById('product-quantity');
    const button = document.getElementById('add-cart-button');

    button.addEventListener('click', (e) => {
        e.preventDefault();

        const quantity = parseInt(quantityInput.value);

        const productObj = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            imageUrl: imageUrl
        }
        const result = CART.addToCart(productObj);
        UTIL.showAddToCartResult(result);
    });
}

export function loadCartPage() {
    loadContainer('template-cart', 'container cart');

    CART.renderCart();
    UTIL.updateCheckoutButton();

    const itensContainer = document.getElementById('cart-items');
    if (itensContainer) {
        itensContainer.addEventListener('click', (e) => {
            e.preventDefault();

            const productId = parseInt(e.target.dataset.id);

            if (e.target.classList.contains('increase-qnt')) {
                const cart = CART.getCartItems();
                const item = cart.find(item => item.id === productId);
                CART.updateQuantity(productId, item.quantity + 1);
                CART.renderCart();
                UTIL.updateCheckoutButton();
            } else if (e.target.classList.contains('decrease-qnt')) {
                const cart = CART.getCartItems();
                const item = cart.find(item => item.id === productId);
                CART.updateQuantity(productId, item.quantity - 1);
                CART.renderCart();
                UTIL.updateCheckoutButton();
            } else if (e.target.classList.contains('remove-item')) {
                CART.removeFromCart(productId);
                CART.renderCart();
                UTIL.updateCheckoutButton();
            }
        });
    }

    const clearCartButton = document.getElementById('clear-cart-button');
    clearCartButton.addEventListener('click', (e) => {
        e.preventDefault();
        CART.clearCart();
        CART.renderCart();
        UTIL.updateCheckoutButton();
    });

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/checkout');
    });
}

export function loadCheckout() {
    loadContainer('template-checkout', 'container checkout');

    CART.renderProductsList();

    const cancelCheckoutButton = document.getElementById('cancel-checkout');
    cancelCheckoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/cart');
    });

    const alert = document.getElementById('alert-checkout');
    const confirmCheckoutButton = document.getElementById('confirm-checkout');
    confirmCheckoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await VALIDATION.validateOrder(alert);
    });
}

export function loadLoginPage() {
    loadContainer('template-login', 'container form');

    const form = document.getElementById('form-login');
    const alert = document.getElementById('alert-login');

    const createAccountButton = document.getElementById('create-account-button');

    createAccountButton.addEventListener('click', (e) => {
        navigateTo('/signup');
    });

    VALIDATION.validateLogin(form, alert);
}

export function loadUserProfilePage() {
    loadContainer('template-profile', 'container profile');

    const accountSettings = document.getElementById('profile-settings');
    accountSettings.addEventListener('click', async (e) => {
        e.preventDefault();
        await loadAccountSettings();
    });

    const passwordSettings = document.getElementById('profile-password');
    passwordSettings.addEventListener('click', async (e) => {
        e.preventDefault();
        await loadPasswordSettings();
    });

    const logout = document.getElementById('profile-logout');
    logout.addEventListener('click', async (e) => {
        e.preventDefault();
        const response = await AUTH.deauthenticateUser();
        if(response === true) {
            navigateTo('/');
        }
    });
}

export function loadCreateAccountPage() {
    loadContainer('template-create-account', 'container form');
    VALIDATION.validateCreateAccount();
}

export function loadAdminPage() {
    loadContainer('template-admin', 'container admin-menu');

    const categories = ['products', 'categories', 'orders', 'users'];
    categories.forEach(category => {
        document.getElementById(category).addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(`/admin/${category}`);
        });
    });
}

// Products functions
export async function loadProductsPage() {
    loadContainer('template-product-menu', 'container table');
    const table = document.getElementById('product-table');
    table.addEventListener('click', function (e) {
        e.preventDefault();
        const click = e.target;
        if (click.classList.contains('update-button')) {
            const id = click.dataset.id;
            navigateTo(`/admin/products/update?update-id=${id}`);
        }
        if (click.classList.contains('delete-button')) {
            const id = click.dataset.id;
            navigateTo(`/admin/products/delete?delete-id=${id}`);
        }
    });
    UTIL.showProductTable(await API.fetchData(`${UTIL.BASE_URL}/clothes`));
}

export async function createProductPage() {
    loadContainer('template-create-product', 'container form');
    await UTIL.createSelectCategories('category-select-create-product');
    const form = document.getElementById('form-create-product');
    const alert = document.getElementById('alert-create-product');
    await VALIDATION.validateProduct(form, alert);
}

export async function updateProductPage() {
    loadContainer('template-update-product', 'container form');

    const product = await UTIL.getParams('update-id', (param) => API.fetchData(`${UTIL.BASE_URL}/clothes/${param}`));
    await UTIL.createSelectCategories('category-select-update-product');
    const form = document.getElementById('form-update-product');
    const alert = document.getElementById('alert-update-product');
    await VALIDATION.validateProduct(form, alert, product.id);
}

export async function deleteProductPage() {
    loadContainer('template-delete-product', 'container form');

    const product = await UTIL.getParams('delete-id', (param) => API.fetchData(`${UTIL.BASE_URL}/clothes/${param}`));
    const currentName = document.getElementById('current-product-name');
    const currentTitle = document.getElementById('current-product-title');
    currentName.style.color = "red";
    currentName.textContent = product.name;

    const button = document.getElementById('delete-product');
    const alert = document.getElementById('alert-delete-product');

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        await API.deleteData(`${UTIL.BASE_URL}/clothes/${product.id}`, alert);
        currentTitle.style.contentVisibility = "hidden";
        currentName.style.contentVisibility = "hidden";
    });
}

// Categories functions
export async function loadCategoriesPage() {
    loadContainer('template-category-menu', 'container table');

    const table = document.getElementById('category-table');
    table.addEventListener('click', function (e) {
        e.preventDefault();

        const click = e.target;
        if (click.classList.contains('update-button')) {
            const id = click.dataset.id;
            navigateTo(`/admin/categories/update?update-id=${id}`);
        }
        if (click.classList.contains('delete-button')) {
            const id = click.dataset.id;
            navigateTo(`/admin/categories/delete?delete-id=${id}`);
        }
    });

    UTIL.showCategoryTable(await API.fetchData(`${UTIL.BASE_URL}/category`));
}

export async function createCategoryPage() {
    loadContainer('template-create-category', 'container form');

    const form = document.getElementById('form-create-category');
    const alert = document.getElementById('alert-create-categ');
    const input = document.getElementById('name-create-category');

    await VALIDATION.validateCategory(form, input, alert);
}

export async function updateCategoryPage() {
    loadContainer('template-update-category', 'container form');

    const category = await UTIL.getParams('update-id', (param) => API.fetchData(`${UTIL.BASE_URL}/category/${param}`));

    const currentName = document.getElementById('current-update-name');
    const currentTitle = document.getElementById('current-update-title');
    currentName.style.color = "red";
    currentName.textContent = category.name;

    const form = document.getElementById('form-update-category');
    const alert = document.getElementById('alert-update-category');
    const nameInput = document.getElementById('name-update-category');
    const id = category.id;

    await VALIDATION.validateCategory(form, nameInput, alert, id);
    document.addEventListener('submit', () => {
        currentName.style.visibility = "hidden";
        currentTitle.style.visibility = "hidden";
    });
}

export async function deleteCategoryPage() {
    loadContainer('template-delete-category', 'container form');

    const category = await UTIL.getParams('delete-id', (param) => API.fetchData(`${UTIL.BASE_URL}/category/${param}`));

    const currentName = document.getElementById('current-category-name');
    const currentTitle = document.getElementById('current-category-title');
    currentName.style.color = "red";
    currentName.textContent = category.name;

    const button = document.getElementById('delete-category');
    const alert = document.getElementById('alert-delete-category');

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        await API.deleteData(`${UTIL.BASE_URL}/category/${category.id}`, alert);
        currentTitle.style.contentVisibility = "hidden";
        currentName.style.contentVisibility = "hidden";
    });
}

//Users functions
export async function loadUserPage() {
    loadContainer('template-users-menu', 'container table');

    const table = document.getElementById('user-table');
    table.addEventListener('click', function (e) {
        e.preventDefault();

        const click = e.target;
        if (click.classList.contains('update-button')) {
            const id = click.dataset.id;
            navigateTo(`/admin/users/update?update-id=${id}`);
        }
        if (click.classList.contains('delete-button')) {
            const id = click.dataset.id;
            navigateTo(`/admin/users/delete?delete-id=${id}`);
        }
    });

    UTIL.showUserTable(await API.fetchData(`${UTIL.BASE_URL}/users`));
}

export async function createUserPage() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-create-user');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);

    const form = document.getElementById('form-create-user');
    const alert = document.getElementById('alert-create-user');
    await VALIDATION.validateUser(form, alert);
}

export async function updateUserPage() {
    loadContainer('template-update-user', 'container form');

    const user = await UTIL.getParams('update-id', (param) => API.fetchData(`${UTIL.BASE_URL}/users/${param}`));
    const form = document.getElementById('form-update-user');
    const alert = document.getElementById('alert-update-user');
    const id = user.id;

    await VALIDATION.validateUser(form, alert, id);
}

export async function deleteUserPage() {
    loadContainer('template-delete-user', 'container form');

    const user = await UTIL.getParams('delete-id', (param) => API.fetchData(`${UTIL.BASE_URL}/users/${param}`));
    const currentName = document.getElementById('current-user-name');
    const currentTitle = document.getElementById('current-user-title');
    currentName.style.color = "red";
    currentName.textContent = user.name;

    const button = document.getElementById('delete-user');
    const alert = document.getElementById('alert-delete-user');

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        await API.deleteData(`${UTIL.BASE_URL}/users/${user.id}`, alert);
        currentTitle.style.contentVisibility = "hidden";
        currentName.style.contentVisibility = "hidden";
    });
}

export function loadError404Page() {
    loadContainer('template-error', 'container error-page');
}

export async function loadUserPurchases() {
    const user = await AUTH.checkAuth();
    if (!user) {
        navigateTo('/login');
    } else {
        loadContainer('template-purchases', 'container orders');
        UTIL.showUserPurchases();
    }
}

//user profile data setting
async function loadAccountSettings() {
    const element = document.getElementById('profile-option');
    element.innerHTML = '';

    const user = await AUTH.checkAuth();
    if (!user) {
        navigateTo('/');
    }

    const accountElement = document.createElement('div');
    accountElement.classList.add('profile-box');
    accountElement.innerHTML = `
            <form id="form-update-profile" novalidate>
                <div class="profile-box-itens">
                
                    <div class="profile-box-item">
                        <label class="bold-title">Full Name</label>
                        <input class="profile-box-input large-input" name="name" type="text" value="${user.name}" minlength="3" maxlength="80" disabled></input>
                    </div>
                
                    <div class="profile-box-item">
                        <label class="bold-title">E-mail</label>
                        <input class="profile-box-input large-input" name="email" type="text" value="${user.email}" maxlength="40" disabled></input>
                    </div>

                    <div class="profile-box-item">
                        <label class="bold-title">CPF</label>
                        <input class="profile-box-input large-input" name="cpf" type="text" value="${user.cpf}" minlength="11" maxlength="11" disabled></input>
                    </div>

                    <div class="profile-box-item">
                        <label class="bold-title">Phone</label>
                        <input class="profile-box-input large-input" name="phone" type="text" value="${user.phone}" minlength="11" maxlength="11" disabled></input>
                    </div>
                </div>

                <div>
                    <label class="alert-message alert" id="account-alert"></label>
                </div>

                <div class="profile-box-buttons">
                    <button id="cancel-update-profile" class="large-red-button display-none">Cancel</button>
                    <button id="update-profile" class="large-blue-button">Update</button>
                    <input type="submit" id="update-profile-button" class="large-green-button display-none" value="Save"></input>
                </div>
            </form>    
    `;
    element.appendChild(accountElement);

    UTIL.bindProfileEvents(user.id);
}

//user profile change password setting
async function loadPasswordSettings() {
    const element = document.getElementById('profile-option');
    element.innerHTML = '';

    const user = await AUTH.checkAuth();
    if (!user) {
        navigateTo('/');
    }

    const accountElement = document.createElement('div');
    accountElement.classList.add('profile-box');
    accountElement.innerHTML = `
            <form id="profile-update-password-form" novalidate>
                <div class="flex-column">
                    
                    <label class="bold-title">Update password</label>
                    
                    <label class="alert-message alert" id="profile-password-alert"></label>
                    
                    <div class="flex-column" id="profile-current-password-div">
                        <label class="bold-title">Enter your current password</label>
                        <input type="password" class="large-input" id="profile-current-password-input" name="password" minlength="8" required>
                        <input type="button" id="profile-current-password-button" class="large-blue-button" value="Confirm"></input>
                    </div>

                    <div class="flex-column display-none" id="profile-update-password-div">
                        <label class="bold-title">Enter your new password</label>
                        <input type="password" class="large-input" id="profile-new-password-input" name="password" minlength="8" required>
                        <label class="bold-title">Confirm your new password</label>
                        <input type="password" class="large-input" id="profile-confirm-password-input" name="password" minlength="8" required>
                        <input type="submit" class="large-blue-button" value="Confirm"></input>
                    </div>

                </div>
            </form>    
    `;
    element.appendChild(accountElement);

    VALIDATION.validateProfilePassword(user.id);
}

export async function updateAuthUI() {
    const loginButton = document.getElementById('nav-login-button');
    if (!loginButton) return;

    const user = await AUTH.checkAuth();

    if (!user) {
        loginButton.textContent = "Login";
    } else {
        loginButton.textContent = "Profile";
    }
}

function loadContainer(templateInput, classNameInput) {
    const container = document.getElementById('container');
    const template = document.getElementById(templateInput);
    const clone = template.content.cloneNode(true);

    container.className = `${classNameInput}`;
    container.innerHTML = "";
    container.appendChild(clone);
}