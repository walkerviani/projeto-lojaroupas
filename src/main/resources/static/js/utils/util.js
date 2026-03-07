import { navigateTo } from "../modules/router.js";
import { checkAuth } from "../services/auth.js";
import { fetchData,  } from "../services/api.js";
import { validateProfile, validateProfilePassword } from "../modules/validations.js";

export const BASE_URL = "http://localhost:8080";

export function capitalizeFirstLetter(text) {
    const string = text.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function currencyFormatterToBRL(number) {
    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function getCategoriesMenu(categories) {
    let list = "";
    for (let category of categories) {
        list += `<li><a href="/" id="${category.name}-menu">${category.name}</a></li>`;
    }
    document.getElementById('categories-dropdown').innerHTML = list;
    return categories;
}

export async function createSelectCategories(selectName) {
    const categories = await fetchData(`${BASE_URL}/category`);

    const select = document.getElementById(selectName);
    for (let category of categories) {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    };
}

export function showProductTable(products) {
    let table = `
    <tr>
        <td>ID</td>
        <td>Name</td>
        <td>Price</td>
        <td>Description</td>
        <td>Size</td>
        <td>Color</td>
        <td></td>
        <td></td>
    </tr>`;

    for (let product of products) {
        table += `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.description}</td>
          <td>${product.size}</td>
          <td>${product.color}</td>
          <td class="table-update-button"><button name="update" data-id="${product.id}" class="update-button">Update</button></td>
          <td class="table-delete-button"><button name="delete" data-id="${product.id}" class="delete-button">Delete</button></td>
        </tr>
        `;
    }
    document.getElementById('product-table').innerHTML = table;
}

export function showCategoryTable(categories) {
    let table = `
    <tr>
        <td>ID</td>
        <td>Name</td>
        <td></td>
        <td></td>
    </tr>`;

    for (let category of categories) {
        table += `
        <tr>
          <td>${category.id}</td>
          <td>${category.name}</td>
          <td class="table-update-button"><button name="update" data-id="${category.id}" class="update-button">Update</button></td>
          <td class="table-delete-button"><button name="delete" data-id="${category.id}" class="delete-button">Delete</button></td>
        </tr>
        `;
    }
    document.getElementById('category-table').innerHTML = table;
}

export function showUserTable(users) {
    let table = `
    <tr>
        <td>ID</td>
        <td>Name</td>
        <td>Email</td>
        <td>Cpf</td>
        <td>Phone</td>
        <td>Role</td>
        <td></td>
        <td></td>
    </tr>`;

    for (let user of users) {
        table += `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.cpf}</td>
          <td>${user.phone}</td>
          <td>${user.role}</td>
          <td class="table-update-button"><button name="update" data-id="${user.id}" class="update-button">Update</button></td>
          <td class="table-delete-button"><button name="delete" data-id="${user.id}" class="delete-button">Delete</button></td>
        </tr>
        `;
    }
    document.getElementById('user-table').innerHTML = table;
}


export async function getParams(paramName, callback) {
    const params = new URLSearchParams(window.location.search);
    if (!params.has(paramName)) return null;

    const param = params.get(paramName);
    return await callback(param);
}

export function showAddToCartResult(result) {
    const button = document.querySelector('.detail-mode button');
    if (!button) return;
    const buttonText = button.innerText;

    button.disabled = true;

    if (result) {
        button.classList.add('success');
        button.innerText = "Added to cart!";
    }
    else {
        button.classList.add('failed');
        button.innerText = "Try Again!";
    }

    setTimeout(() => {
        button.disabled = false;
        button.classList.remove('success', 'failed');
        button.innerText = buttonText;
    }, 3000);
}

export function updateCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');
    const cart = localStorage.getItem('cart');

    if (!cart || JSON.parse(cart).length === 0) {
        checkoutButton.style.display = "none";
    } else {
        checkoutButton.style.display = "flex";
    }
}

export function updateAlert(alertElement, message, color) {
    alertElement.style.color = color;
    alertElement.textContent = message;
    alertElement.scrollIntoView({ behavior: "smooth", block: "center" });
}

export async function showUserPurchases() {
    const templateElement = document.getElementById('user-purchases');
    templateElement.innerHTML = '';

    const user = await checkAuth();
    if (!user) return null;

    const orders = await fetchData(`${BASE_URL}/orders/client/${user.id}`);
    const ordersArray = Array.isArray(orders) ? orders : [orders];

    if (ordersArray.length === 0) {
        const orderInfo = "You don't have any orders yet!";
        templateElement.classList.add('orders-info');
        return templateElement.innerHTML = orderInfo;
    }

    ordersArray.forEach((order, index) => {
        let orderNumber = index + 1;
        const purchaseDate = new Date(order.moment).toLocaleDateString('pt-BR');

        const purchaseElement = document.createElement('div');
        purchaseElement.classList.add('orders-card');

        let orderInfo = `<div class="orders-info">Order ${orderNumber} - Status: ${order.orderStatus} - ${purchaseDate}</div>`;

        order.items.forEach(item => {
            const clothes = item.clothes;
            const imageName = clothes.imageData?.name;
            const imageUrl = imageName
                ? `${BASE_URL}/image/${imageName}`
                : 'https://placehold.co/400x400?text=No+Image';

            orderInfo += `
                 <div class="orders-content">
                      <div><img src="${imageUrl}"></div>
                      <div class="cart-content">
                      <p>${clothes.name} - ${currencyFormatterToBRL(clothes.price)}</p>
                      <p>Quantity: ${item.quantity}</p>
                      <p>Total: ${currencyFormatterToBRL(item.subtotal)}</p>
                      </div>
                 </div>
        `;
        });

        orderInfo += `<div>Order Total: ${currencyFormatterToBRL(order.total)}</div>`;
        purchaseElement.innerHTML = orderInfo;
        templateElement.appendChild(purchaseElement);
    });
}

export async function loadAccountSettings() {
    const element = document.getElementById('profile-option');
    element.innerHTML = '';

    const user = await checkAuth();
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

    editAccount(user.id);
}

function editAccount(userId) {
    const updateButton = document.getElementById('update-profile');
    const cancelButton = document.getElementById('cancel-update-profile');
    const saveButton = document.getElementById('update-profile-button');

    const alert = document.getElementById('account-alert');
    const form = document.getElementById('form-update-profile');

    const inputs = form.querySelectorAll('.profile-box-input');

    updateButton.addEventListener('click', async (e) => {
        e.preventDefault();

        cancelButton.style.display = "block";
        saveButton.style.display = "block";
        updateButton.style.display = "none";

        inputs.forEach(input => input.disabled = false);
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();

        form.reset();

        alert.textContent = "";
        cancelButton.style.display = "none";
        saveButton.style.display = "none";
        updateButton.style.display = "block";

        inputs.forEach(input => input.disabled = true);

    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await validateProfile(form, alert, userId);
    });
}

export async function loadPasswordSettings() {
    const element = document.getElementById('profile-option');
    element.innerHTML = '';

    const user = await checkAuth();
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

    validateProfilePassword(user.id);
}