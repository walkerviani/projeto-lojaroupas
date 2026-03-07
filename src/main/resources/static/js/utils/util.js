import { navigateTo } from "../modules/router.js";
import { checkAuth } from "../services/auth.js";
import { fetchData, } from "../services/api.js";
import { validateProfileData } from "../modules/validations.js";

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

export function bindProfileEvents(userId) {
    const updateButton = document.getElementById('update-profile');
    const cancelButton = document.getElementById('cancel-update-profile');
    const saveButton = document.getElementById('update-profile-button');

    const alert = document.getElementById('account-alert');
    const form = document.getElementById('form-update-profile');

    const inputs = form.querySelectorAll('.profile-box-input');

    updateButton.addEventListener('click', (e) => {
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
        await validateProfileData(form, alert, userId);
    });
}