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
            ? `${UTIL.BASE_URL}/api/image/${product.imageData.name}`
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

    //if param is name (searchbar)
    if (name) {
        products = await UTIL.getParams('name', (param) => API.fetchData(`${UTIL.BASE_URL}/api/clothes/name?name=${param}`));
    }
    //if param is category (category dropdown)
    else if (category) {
        products = await UTIL.getParams('category', (param) => API.fetchData(`${UTIL.BASE_URL}/api/clothes/category?category=${param}`));
    }
    //if does not have a param = show products
    else {
        products = await API.fetchData(`${UTIL.BASE_URL}/api/clothes`);
    }
    showProductsCard(products);
}

export async function showProductDetail() {
    loadContainer('template-detail', 'container detail-mode');

    const product = await UTIL.getParams('id', (param) => API.fetchData(`${UTIL.BASE_URL}/api/clothes/${param}`));
    const imageUrl = product.imageData ? `${UTIL.BASE_URL}/api/image/${product.imageData.name}` : 'https://placehold.co/400x400?text=No+Image';

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
        await VALIDATION.validateUserOrder(alert);
    });
}

export function loadLoginPage() {
    loadContainer('template-login', 'container form');

    const createAccountButton = document.getElementById('create-account-button');

    createAccountButton.addEventListener('click', () => {
        navigateTo('/signup');
    });

    VALIDATION.validateLogin();
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
        if (response === true) {
            navigateTo('/');
        }
    });
}

export function loadCreateAccountPage() {
    loadContainer('template-create-account', 'container form');
    VALIDATION.validateCreateAccount();
}

// Load '/admin' menu
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

// Products table in '/admin'
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
    UTIL.showProductTable(await API.fetchData(`${UTIL.BASE_URL}/api/clothes`));
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

// Categories table in '/admin'
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

    UTIL.showCategoryTable(await API.fetchData(`${UTIL.BASE_URL}/api/category`));
}

export async function createCategoryPage() {
    loadContainer('template-create-category', 'container form');
    await VALIDATION.validateCategory();
}

export async function updateCategoryPage() {
    loadContainer('template-update-category', 'container form');

    const category = await UTIL.getParams('update-id', (param) => API.fetchData(`${UTIL.BASE_URL}/api/category/${param}`));

    const id = category.id;

    // Show current category name
    const currentName = document.getElementById('current-update-name');
    // "Current name" text
    const currentTitle = document.getElementById('current-update-title');
    currentName.style.color = "red";
    currentName.textContent = category.name;

    await VALIDATION.validateCategory(id);
    document.addEventListener('submit', () => {
        currentName.style.visibility = "hidden";
        currentTitle.style.visibility = "hidden";
    });
}

export async function deleteCategoryPage() {
    loadContainer('template-delete-category', 'container form');

    const category = await UTIL.getParams('delete-id', (param) => API.fetchData(`${UTIL.BASE_URL}/api/category/${param}`));

    // Show current category name
    const currentName = document.getElementById('current-category-name');
    // "Current name" text
    const currentTitle = document.getElementById('current-category-title');
    currentName.style.color = "red";
    currentName.textContent = category.name;

    const button = document.getElementById('delete-category');

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const response = await API.deleteData(`${UTIL.BASE_URL}/api/admin/categories/${category.id}`);
        currentTitle.style.contentVisibility = "hidden";
        currentName.style.contentVisibility = "hidden";
        if (response.success === true) {
            UTIL.updateAlert(response.message, "green");
            setTimeout(() => {
                navigateTo('/admin/categories');
            }, 2000);
        } else {
            UTIL.updateAlert(response.message, "red");
        }
    });
}

// Users table in '/admin'
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

    UTIL.showUserTable(await API.fetchData(`${UTIL.BASE_URL}/api/admin/users`));
}

export async function createUserPage() {
    loadContainer('template-create-user', 'container form');
    await VALIDATION.validateUser();
}

export async function updateUserPage() {
    loadContainer('template-update-user', 'container form');

    const user = await UTIL.getParams('update-id', (param) => API.fetchData(`${UTIL.BASE_URL}/api/admin/users/${param}`));
    const userId = user.id;

    await VALIDATION.validateUser(userId);
}

export async function deleteUserPage() {
    loadContainer('template-delete-user', 'container form');

    const user = await UTIL.getParams('delete-id', (param) => API.fetchData(`${UTIL.BASE_URL}/api/admin/users/${param}`));
    const currentName = document.getElementById('current-user-name');
    const currentTitle = document.getElementById('current-user-title');
    currentName.style.color = "red";
    currentName.textContent = user.name;

    const button = document.getElementById('delete-user');
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const response = await API.deleteData(`${UTIL.BASE_URL}/api/admin/users/${user.id}`);
        currentTitle.style.contentVisibility = "hidden";
        currentName.style.contentVisibility = "hidden";
        if (response.success === true) {
            UTIL.updateAlert(response.message, "green");
            setTimeout(() => {
                navigateTo('/admin/users');
            }, 1000);
        } else {
            UTIL.updateAlert(response.message, "red");
        }
    });
}

// Orders table in '/admin'
export async function loadOrdersPage() {
    loadContainer('template-orders-menu', 'container table');

    const table = document.getElementById('orders-table');
    table.addEventListener('click', function (e) {
        e.preventDefault();

        const click = e.target;
        if (click.classList.contains('detail-button')) {
            const id = click.dataset.id;
            navigateTo(`/admin/orders/detail?detail-id=${id}`);
        }
        if (click.classList.contains('update-button')) {
            const id = click.dataset.id;
            navigateTo(`/admin/orders/update?update-id=${id}`);
        }
        if (click.classList.contains('delete-button')) {
            const id = click.dataset.id;
            navigateTo(`/admin/orders/delete?delete-id=${id}`);
        }
    });

    UTIL.showOrdersTable(await API.fetchData(`${UTIL.BASE_URL}/orders`));
}

// Create an order in '/admin'
export function createOrdersPage() {
    loadContainer('template-create-order', 'container form');

    sessionStorage.removeItem('orderItems'); // Reset session storage when loading the page

    const form = document.getElementById('form-create-order');
    const alert = document.getElementById('alert-create-order');

    UTIL.renderSelectedItems();
    UTIL.bindOrderEvents('product-found-create-order');
    UTIL.bindSelectedItemsEvent();

    // Find user by id button
    const clientIdButton = document.getElementById('find-user-by-id');
    clientIdButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await UTIL.renderUserData();
    });

    // Find products by name button
    const findProductButton = document.getElementById('find-product-by-name');
    findProductButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await UTIL.renderProductSearch();
    });

    // Clear search products button
    const clearSearchButton = document.getElementById('clear-search-product');
    const display = document.getElementById('product-found-create-order');
    clearSearchButton.addEventListener('click', (e) => {
        e.preventDefault();
        display.innerHTML = "";
    });

    // Validate the form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await VALIDATION.validateAdminOrder(alert, form);
    });
}

export async function updateOrdersPage() {
    loadContainer('template-update-order', 'container form');

    sessionStorage.removeItem('orderItems'); // Reset session storage when loading the page

    const order = await UTIL.getParams('update-id', (param) => API.fetchData(`${UTIL.BASE_URL}/orders/${param}`));
    const form = document.getElementById('form-update-order');
    const alert = document.getElementById('alert-update-order');
    const id = order.Id;

    VALIDATION.updateOrderForm(form, order);
    UTIL.renderSelectedItems();
    UTIL.bindOrderEvents();
    UTIL.bindSelectedItemsEvent();

    // Find user by id button
    const clientIdButton = document.getElementById('find-user-by-id-update-order');
    clientIdButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await UTIL.renderUserData();
    });

    // Find products by name button
    const findProductButton = document.getElementById('find-product-by-name-update-order');
    findProductButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await UTIL.renderProductSearch();
    });

    // Clear search products button
    const clearSearchButton = document.getElementById('clear-search-product-update-order');
    const display = document.getElementById('product-found-update-order');
    clearSearchButton.addEventListener('click', (e) => {
        e.preventDefault();
        display.innerHTML = "";
    });

    // Validate the form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await VALIDATION.validateAdminOrder(alert, form, id);
    });
}

// Delete an order in '/admin'
export async function deleteOrdersPage() {
    loadContainer('template-delete-order', 'container form');

    const order = await UTIL.getParams('delete-id', (param) => API.fetchData(`${UTIL.BASE_URL}/orders/${param}`));

    const button = document.getElementById('delete-order');
    const alert = document.getElementById('alert-delete-order');

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        await API.deleteData(`${UTIL.BASE_URL}/orders/${order.Id}`, alert);
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

// User profile data setting
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

// User profile change password setting
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

// Show more details about the selected order in '/admin/orders'
export async function loadOrderDetail() {
    loadContainer('template-order-detail', 'container orders');

    const templateElement = document.getElementById('order-detail');
    templateElement.innerHTML = '';

    const order = await UTIL.getParams('detail-id', (param) => API.fetchData(`${UTIL.BASE_URL}/orders/${param}`));

    const purchaseDate = new Date(order.moment).toLocaleDateString('pt-BR');

    const purchaseElement = document.createElement('div');
    purchaseElement.classList.add('orders-card');

    let orderInfo = `
    <p><b>Order ${order.Id} - Status: ${order.orderStatus} - ${purchaseDate}</b></p>
    <p><b>Customer Data:</b></p>
    <div class="orders-customer-info">
    <p><b>Id:</b> ${order.client.id}</p>
    <p><b>Name:</b> ${order.client.name}</p>
    <p><b>Email:</b> ${order.client.email}</p>
    <p><b>CPF:</b> ${order.client.cpf}</p>
    <p><b>Phone:</b> ${order.client.phone}</p>
    </div>
    `;

    orderInfo += `<b>Itens:</b>`;
    order.items.forEach(item => {
        const clothes = item.clothes;
        const imageName = clothes.imageData?.name;
        const imageUrl = imageName
            ? `${UTIL.BASE_URL}/image/${imageName}`
            : 'https://placehold.co/400x400?text=No+Image';

        orderInfo += `
                     <div class="orders-content">
                          <div><img src="${imageUrl}"></div>
                          <div class="cart-content">
                          <p>${clothes.name} - ${UTIL.currencyFormatterToBRL(clothes.price)}</p>
                          <p>Quantity: ${item.quantity}</p>
                          <p>Total: ${UTIL.currencyFormatterToBRL(item.subtotal)}</p>
                          </div>
                     </div>
            `;
    });

    orderInfo += `<div><b>Order Total:</b> ${UTIL.currencyFormatterToBRL(order.total)}</div>`;
    purchaseElement.innerHTML = orderInfo;
    templateElement.appendChild(purchaseElement);
}

// Update navigation bar login button based on the authentication status
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

// Load page container using template ID and CSS class
function loadContainer(templateInput, classNameInput) {
    const container = document.getElementById('container');
    const template = document.getElementById(templateInput);
    const clone = template.content.cloneNode(true);

    container.className = `${classNameInput}`;
    container.innerHTML = "";
    container.appendChild(clone);
}