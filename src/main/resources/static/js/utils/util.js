import { navigateTo } from "../modules/router.js";
import { checkAuth } from "../services/auth.js";
import { fetchOrder, fetchData } from "../services/api.js";

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

export async function updateProductForm(formInput, product, imagePreview) {
    const { name, price, description, size, color, category } = formInput.elements;
    name.value = product.name;
    price.value = product.price;
    description.value = product.description;
    size.value = product.size;
    color.value = product.color;
    category.value = product.category.id;
    imagePreview.src = `${BASE_URL}/image/${product.imageData.name}`;
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

//used to show to the user if the add to cart function had success or failed
export function actionButton(result) {
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