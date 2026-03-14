import { navigateTo } from "../modules/router.js";
import { checkAuth } from "../services/auth.js";
import { fetchData, findProductByName } from "../services/api.js";
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

//Admin route product menu table
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

//Admin route category menu table
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

//Admin route user menu table
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

//Admin route orders menu table
export function showOrdersTable(orders) {
    let table = `
    <tr>
        <td>ID</td>
        <td>Date</td>
        <td>Status</td>
        <td>Total</td>
        <td>Client</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>`;

    for (let order of orders) {
        let date = new Date(order.moment).toLocaleDateString("pt-BR");
        table += `
        <tr>
          <td>${order.Id}</td>
          <td>${date}</td>
          <td>${order.orderStatus}</td>
          <td>${currencyFormatterToBRL(order.total)}</td>
          <td>${order.client.name}</td>
          <td class="table-detail-button"><button name="detail" data-id="${order.Id}" class="detail-button">Details</button></td>
          <td class="table-update-button"><button name="update" data-id="${order.Id}" class="update-button">Update</button></td>
          <td class="table-delete-button"><button name="delete" data-id="${order.Id}" class="delete-button">Delete</button></td>
        </tr>
        `;
    }
    document.getElementById('orders-table').innerHTML = table;
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

// Render product search in '/admin' create order
export async function renderProductSearch() {
    const alert = document.querySelector(".alert");
    const input = document.querySelector(".renderProductSearch-input");
    const display = document.querySelector(".product-found");
    const query = input.value;

    if (!query) {
        return updateAlert(alert, "Type a product name", "red");
    }

    display.innerHTML = "";

    const result = await findProductByName(query);

    if (result.success) {
        const product = result.data;

        if (!product || product.length === 0) {
            return updateAlert(alert, "No products found", "red");
        }

        display.innerHTML = "Products: ";
        product.forEach((item) => {

            const itemElement = document.createElement('div');
            itemElement.classList.add('product-display');
            itemElement.innerHTML = `
                <p>${item.name} - ${currencyFormatterToBRL(item.price)}</p>
                <p>Quantity</p>
                
                <div class="flex-row">
                    <button class="quantity-controls decrease-qnt" data-id="${item.id}">-</button>
                    <span class="qnt-value" id="item-qnt-${item.id}">0</span>
                    <button class="quantity-controls increase-qnt" data-id="${item.id}">+</button>
                </div>
                
                <button class="small-green-button" data-id="${item.id}" data-price="${item.price}" data-name="${item.name}" style="margin-top: 5px">Add to order</button>
            `;

            display.appendChild(itemElement);
        });
    } else {
        return updateAlert(alert, `${result.message} `, "red");
    }
}

// Bind order events in '/admin' create order
export function bindOrderEvents() {
    const display = document.querySelector('.product-found');
    if (!display) return;

    display.addEventListener('click', (e) => {
        e.preventDefault();

        const click = e.target;
        const productId = click.getAttribute('data-id');
        const productName = click.getAttribute('data-name');

        if (!productId) return;

        const qntSpan = document.getElementById(`item-qnt-${productId}`);

        // Increase product quantity
        if (click.classList.contains('increase-qnt')) {
            qntSpan.textContent = parseInt(qntSpan.textContent) + 1;
        }

        // Decrease product quantity
        if (click.classList.contains('decrease-qnt')) {
            let currentValue = parseInt(qntSpan.textContent);
            if (currentValue > 0) qntSpan.textContent = currentValue - 1;
        }

        // Handle "add to cart" button click
        if (click.classList.contains('small-green-button')) {
            const quantity = parseInt(qntSpan.textContent);
            if (!quantity <= 0) {
                const productData = {
                    id: productId,
                    name: productName,
                    price: parseInt(click.getAttribute('data-price') * 100),
                    quantity: quantity
                }

                // Add to session storage
                addToOrderStorage(productData);

                // Reset product quantity after adding to session storage
                qntSpan.textContent = "0";
            } else {
                const alert = document.querySelector(".alert");
                updateAlert(alert, "Product quantity must be greater than 0 to add", "red");
            }
        }
    });
}

// Add selected product in bindOrderEvents to session storage
function addToOrderStorage(product) {
    // Check if there are saved items, otherwise create an empty array
    let orderItems = JSON.parse(sessionStorage.getItem('orderItems')) || [];

    const existingItem = orderItems.find(item => item.id === product.id);

    // If the item already exists in the cart, just update the quantity
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        // If its not added, add to the array
        orderItems.push(product);
    }

    // Save the updated array back to session storage
    sessionStorage.setItem('orderItems', JSON.stringify(orderItems));

    renderSelectedItems();
}

// Render selected items (items that are saved in session storage) in '/admin' create order
export function renderSelectedItems() {
    const orderItems = JSON.parse(sessionStorage.getItem('orderItems')) || [];
    const selectedItemsElement = document.querySelector(".product-added");
    
    selectedItemsElement.innerHTML = '';

    if (orderItems.length === 0) {
        selectedItemsElement.textContent = "No items added yet.";
        return;
    }

    selectedItemsElement.textContent = "Items: ";
    let cartTotal = 0;

    orderItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.classList.add('product-display');
        itemElement.innerHTML = `
        <div>
            <p>${item.name} - ${currencyFormatterToBRL(item.price / 100)}</p>
            <div class="flex-row">
                <button class="quantity-controls decrease-cart-qnt" data-id="${item.id}">-</button>
                <span class="qnt-value" id="cart-item-qnt-${item.id}">${item.quantity}</span>
                <button class="quantity-controls increase-cart-qnt" data-id="${item.id}">+</button>
            </div>
            <p>Item total: ${currencyFormatterToBRL(itemTotal / 100)}</p>
        </div>
        <button class="small-red-button" data-id="${item.id}" style="margin-top: 5px">Remove item</button>
        `;

        selectedItemsElement.appendChild(itemElement);
    });
    // Add order total price
    const totalElement = document.createElement('h3');
    totalElement.textContent = `Order Total: ${currencyFormatterToBRL(cartTotal / 100)}`
    selectedItemsElement.appendChild(totalElement);
}

export function bindSelectedItemsEvent() {
    const display = document.querySelector('.product-added');
    if (!display) return;

    display.addEventListener('click', (e) => {
        e.preventDefault();

        const click = e.target;
        const productId = click.getAttribute('data-id');

        if (!productId) return;

        // Get order cart
        let orderItems = JSON.parse(sessionStorage.getItem('orderItems')) || [];

        // Search product index on the array
        const productIndex = orderItems.findIndex(item => item.id == productId);
        if (productIndex === -1) return; // If not found, stop the execution

        // Increase product quantity
        if (click.classList.contains('increase-cart-qnt')) {
            orderItems[productIndex].quantity += 1;
            sessionStorage.setItem('orderItems', JSON.stringify(orderItems));
            renderSelectedItems(); // Render the items again
        }

        // Decrease product quantity
        if (click.classList.contains('decrease-cart-qnt')) {
            // Only decrease if quantity is bigger than 1
            if (orderItems[productIndex].quantity > 1) {
                orderItems[productIndex].quantity -= 1;
                sessionStorage.setItem('orderItems', JSON.stringify(orderItems));
                renderSelectedItems(); // Render the items again
            }
        }

        // Decrease product quantity
        if (click.classList.contains('small-red-button')) {
            // Remove the item from the array
            orderItems.splice(productIndex, 1);
            sessionStorage.setItem('orderItems', JSON.stringify(orderItems));
            renderSelectedItems(); // Render the items again
        }
    });
}

// Display user data in '/admin' after providing an user Id
export async function renderUserData() {
    const alert = document.querySelector(".alert");
    const input = document.querySelector(".renderUserData-input");
    const display = document.querySelector(".renderUserData-display");
    const query = input.value;

    if (!query) {
        return updateAlert(alert, "Type an user id", "red");
    }

    display.innerHTML = "";

    const user = await fetchData(`${BASE_URL}/users/${query}`);

    if(user) {
        display.innerHTML = `
            <div style="align-items:start">
                <h3>User Data</h3>
                <p><b>Name:</b> ${user.name}</p>
                <p><b>E-mail:</b> ${user.email}</p>
                <p><b>CPF:</b> ${user.cpf}</p>
            </div>
        `;
    } else {
        return updateAlert(alert, "User not found", "red");
    }
}