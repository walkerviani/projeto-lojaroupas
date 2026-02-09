import { navigateTo } from "./router.js";
import { BASE_URL, capitalizeFirstLetter, currencyFormatterToBRL, showProductTable, getProducts } from "./util.js";
import { validateCreateAccount } from "./form-validations.js";

export function showProducts(products) {
    const container = document.getElementById('container');
    container.innerHTML = "";

    if (!products || products.length === 0) {
        container.innerHTML = "<p>No products found</p>";
        return;
    }
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
        <div class="card-image" id="card">
            <img src="${product.imageUrl}">
            </div >
            <div>
                <h3>${product.name}</h3>
                <p>${currencyFormatterToBRL(product.price)}</p>
            </div>
            `;
        card.addEventListener('click', () => navigateTo(`?id=${product.id}`));
        container.appendChild(card);
    });
}

export function showProductDetail(product) {
    const container = document.getElementById('container');
    const template = document.getElementById('template-detail');
    const clone = template.content.cloneNode(true);

    // product image
    clone.querySelector(".detail-mode-image").src = product.imageUrl; 
    // product title
    clone.querySelector(".detail-mode-title").textContent = product.name; 
    // product price
    clone.querySelector(".detail-mode-price").textContent = currencyFormatterToBRL(product.price); 
    // product color
    clone.querySelector(".detail-mode-color").innerHTML = `<b>Color:</b> ${capitalizeFirstLetter(product.color)}`; 
    // product description
    clone.querySelector(".detail-mode-description").innerHTML = `<b>Composition:</b> ${product.description}`; 
    
    container.classList.add('detail-mode');
    container.innerHTML = "";
    container.appendChild(clone);

}

export function loadAboutPage() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-aboutpage');
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

    validateCreateAccount();
}

export function loadAdminPage() {
    const container = document.getElementById('container');
    const template = document.getElementById('template-admin');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);

    const categories = ['products', 'orders', 'users'];
    categories.forEach(category => {
        document.getElementById(category).addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(`/admin-${category}`);
        });
    });
}

export function loadAdminProductsPage(){
    const container = document.getElementById('container');
    const template = document.getElementById('template-admin-prodpage');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);

    const options = ['create-product', 'read-product', 'update-product', 'delete-product'];
    options.forEach(option => {
        document.getElementById(option).addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(`/admin-${option}`);
        });
    });
}

export async function readAdminProducts(){
    const container = document.getElementById('container');
    const template = document.getElementById('template-admin-prod');
    const clone = template.content.cloneNode(true);

    container.className = "container form";
    container.innerHTML = "";
    container.appendChild(clone);
    showProductTable(await getProducts(`${BASE_URL}/clothes`));
}

export function loadError404(){
    const container = document.getElementById('container');
    const template = document.getElementById('template-error');
    const clone = template.content.cloneNode(true);

    container.className = 'container error-page';
    container.innerHTML = "";
    container.appendChild(clone);
}