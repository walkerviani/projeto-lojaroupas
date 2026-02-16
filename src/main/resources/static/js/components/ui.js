import { navigateTo } from "./router.js";
import * as UTIL from "./util.js";
import * as FORMS from "./form-validations.js";

export function showProducts(products) {
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
        card.classList.add('card');
        card.innerHTML = `
        <div class="card-image" id="card">
            <img src="${imageUrl}">
            </div >
            <div>
                <h3>${product.name}</h3>
                <p>${UTIL.currencyFormatterToBRL(product.price)}</p>
            </div>
            `;
        card.addEventListener('click', () => navigateTo(`?id=${product.id}`));
        container.appendChild(card);
    });
}

export async function loadIndex() {
    const products = await UTIL.getProducts(`${UTIL.BASE_URL}/clothes`);
    showProducts(products);
}

export function showProductDetail(product) {
    const container = document.getElementById('container');
    const template = document.getElementById('template-detail');
    const clone = template.content.cloneNode(true);

    const imageUrl = product.imageData
        ? `${UTIL.BASE_URL}/image/${product.imageData.name}`
        : 'https://placehold.co/400x400?text=No+Image';

    // product image
    clone.querySelector(".detail-mode-image").src = imageUrl;
    // product title
    clone.querySelector(".detail-mode-title").textContent = product.name;
    // product price
    clone.querySelector(".detail-mode-price").textContent = UTIL.currencyFormatterToBRL(product.price);
    // product color
    clone.querySelector(".detail-mode-color").innerHTML = `<b>Color:</b> ${UTIL.capitalizeFirstLetter(product.color)}`;
    // product description
    clone.querySelector(".detail-mode-description").innerHTML = `<b>Composition:</b> ${product.description}`;

    container.classList.add('detail-mode');
    container.innerHTML = "";
    container.appendChild(clone);

}

export function loadAboutPage() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-about-page');
    const clone = template.content.cloneNode(true);

    container.className = 'container about';
    container.innerHTML = "";
    container.appendChild(clone);
}

export function loadLoginPage() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-login');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);

    document.getElementById('createButton').addEventListener('click', () => {
        navigateTo('/signup');
    });
}

export function loadCreateAccount() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-create-account');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);

    FORMS.validateCreateAccount();
}

export function loadAdminPage() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-admin');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);

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
    const container = document.getElementById('container');
    const template = document.getElementById('template-product-menu');
    const clone = template.content.cloneNode(true);

    container.className = "container table";
    container.innerHTML = "";
    container.appendChild(clone);

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

    UTIL.showProductTable(await UTIL.getProducts(`${UTIL.BASE_URL}/clothes`));
}

export async function createProducts() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-create-product');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);
    UTIL.createSelectCategories(await UTIL.getCategories(`${UTIL.BASE_URL}/category`), 'category-select-create-product');
    FORMS.validateProduct();
}

// Categories functions
export async function loadCategoriesPage() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-category-menu');
    const clone = template.content.cloneNode(true);

    container.className = "container table";
    container.innerHTML = "";
    container.appendChild(clone);

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

    UTIL.showCategoryTable(await UTIL.getCategories(`${UTIL.BASE_URL}/category`));
}

export async function createCategory() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-create-category');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);

    const form = document.getElementById('form-create-category');
    const alert = document.getElementById('alert-create-categ');
    const input = document.getElementById('name-create-category');

    FORMS.validateCategory(form, input, alert, async (obj) => {
        await FORMS.postCategory(obj, alert, form);
    });
}

export async function updateCategory() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-update-category');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);

    const params = new URLSearchParams(window.location.search);
    const category = await UTIL.getParams(params, 'update-id', `${UTIL.BASE_URL}/category`, 'category');

    const currentName = document.getElementById('current-update-name');
    const currentTitle = document.getElementById('current-update-title');
    currentName.textContent = category.name;

    const form = document.getElementById('form-update-category');
    const alert = document.getElementById('alert-update-category');
    const input = document.getElementById('name-update-category');
    const id = category.id;

    FORMS.validateCategory(form, input, alert, async (obj) => {
        await FORMS.putCategory(obj, alert, form, id);
        currentTitle.style.contentVisibility = "hidden";
        currentName.style.contentVisibility = "hidden";
    });
}

export async function deleteCategory() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-delete-category');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);

    const params = new URLSearchParams(window.location.search);
    const category = await UTIL.getParams(params, 'delete-id', `${UTIL.BASE_URL}/category`, 'category');

    const currentName = document.getElementById('current-delete-name');
    const currentTitle = document.getElementById('current-delete-title');
    currentName.textContent = category.name;

    const button = document.getElementById('delete-category');
    const alert = document.getElementById('alert-delete-category');

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        await UTIL.deleteCategories(category.id, alert);
        currentTitle.style.contentVisibility = "hidden";
        currentName.style.contentVisibility = "hidden";
    });
}

export function loadError404() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-error');
    const clone = template.content.cloneNode(true);

    container.className = 'container error-page';
    container.innerHTML = "";
    container.appendChild(clone);
}