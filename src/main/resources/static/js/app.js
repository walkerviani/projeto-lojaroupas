const BASE_URL = "http://localhost:8080";

async function getProducts(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

async function showAllProducts() {
    const url = BASE_URL + "/clothes";
    const products = await getProducts(url);
    showProducts(products);
}

function showCategoryMenu() {
    const menu = document.getElementById('categoriesMenu');

    document.getElementById('categoriesButton').addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = getComputedStyle(menu).display === "none";
        menu.style.display = isHidden ? "block" : "none";
    });
}

async function findClothesByName() {
    document.getElementById('searchButton').addEventListener('click', async (e) => {
        e.preventDefault();
        const searchValue = document.getElementById('searchInput').value.trim();

        if (!searchValue) return;

        const url = BASE_URL + `/clothes/name?name=${searchValue}`;
        const products = await getProducts(url);
        showProducts(products);

        history.pushState({ type: 'search', query: searchValue, products: products }, "", `search?q=${searchValue}`);
    })

}

async function findByCategoryName() {

    const categories = ['shirt', 'skirt', 'coat'];

    categories.forEach(category => {
        const element = document.getElementById(category);

        if (element) {
            element.addEventListener('click', async (e) => {
                e.preventDefault();
                const url = `${BASE_URL}/clothes/category?category=${category}`;
                const products = await getProducts(url);
                showProducts(products);
                history.pushState(
                    { type: 'category', category: category, products: products },
                    "",
                    `?category=${category}`
                );
            })
        }
    });
}

function mainPageShortcut() {
    document.getElementById('logo').addEventListener('click', () => {
        window.location.href = BASE_URL;
    });
}

function showProducts(products) {
    const grid = document.getElementById('productGrid');

    //removes the detail class so the list can show correctly
    grid.classList.remove('detail-mode');

    grid.innerHTML = "";

    if (!products || products.length === 0) {
        grid.innerHTML = "<p>No products found</p>";
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

        card.addEventListener('click', () => {
            showProductDetail(product);
            history.pushState({ type: 'product', data: product }, "", `?id=${product.id}`);
        });

        grid.appendChild(card);
    });
}

function showProductDetail(product) {
    const grid = document.getElementById('productGrid');
    grid.classList.add('detail-mode');
    grid.innerHTML = `<div>
    <img src="${product.imageUrl}">
    </div>
    <div class="detail-mode-info">
    <p class="detail-mode-title">${product.name}<p>
    <p class="detail-mode-price"> ${currencyFormatterToBRL(product.price)}<p>
    <p class="detail-mode-color"><b>Color:</b> ${capitalizeFirstLetter(product.color)}<p>
    <p><b>Composition:</b> ${product.description}<p>
    </br>
    <p><b>Size</b><p>
    <form>
    <input type="radio" id="small" name="sizeChoice" value="SMALL">
    <label for="small">Small</label>
    </br>
    <input type="radio" id="medium" name="sizeChoice" value="MEDIUM">
    <label for="medium">Medium</label>
    </br>
    <input type="radio" id="large" name="sizeChoice" value="LARGE">
    <label for="large">Large</label>
    </br>
    </br>
    <input type="button" class="detail-mode-button" value="Buy">
    </form>
    </div>
    `;
}

function capitalizeFirstLetter(text) {
    const str = text.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function currencyFormatterToBRL(number) {
    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumSignificantDigits: 4
    });
}

document.addEventListener("DOMContentLoaded", () => {

    history.replaceState({ type: 'home' }, "", window.location.href);

    showAllProducts();
    showCategoryMenu();
    findClothesByName();
    findByCategoryName();
    mainPageShortcut();

    window.addEventListener("popstate", (event) => {
        const state = event.state;

        if (!state || state.type === 'home') {
            showAllProducts();
            return;
        }

        if (state.type === 'product' && state.data) {
            showProductDetail(state.data);
            return;
        }

        if (state.type === 'search' && state.products) {
            showProducts(state.products);
            return;
        }
        if (state.type === 'category' && state.products) {
            showProducts(state.products);
            return;
        }
    });
});