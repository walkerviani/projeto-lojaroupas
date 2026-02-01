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
    const container = document.getElementById('container');
    container.className = 'container';
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
        card.addEventListener('click', () => {
            showProductDetail(product);
            history.pushState({ type: 'product', data: product }, "", `?id=${product.id}`);
        });
        container.appendChild(card);
    });
}

function showProductDetail(product) {
    const container = document.getElementById('container');
    container.classList.add('detail-mode');
    container.innerHTML = `<div>
    <img src="${product.imageUrl}">
    </div>
    <div class="detail-mode-info">
    <p class="detail-mode-title">${product.name}<p>
    <p class="detail-mode-price"> ${currencyFormatterToBRL(product.price)}<p>
    <p class="detail-mode-color"><b>Color:</b> ${capitalizeFirstLetter(product.color)}<p>
    <p><b>Composition:</b> ${product.description}<p><br>
    <p><b>Size</b><p>
    <form>
    <input type="radio" id="small" name="sizeChoice" value="SMALL">
    <label for="small">Small</label><br>
    <input type="radio" id="medium" name="sizeChoice" value="MEDIUM">
    <label for="medium">Medium</label><br>
    <input type="radio" id="large" name="sizeChoice" value="LARGE">
    <label for="large">Large</label><br><br>
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

function aboutPage() {
    const button = document.getElementById('aboutButton');
    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            loadAboutPage();
            history.pushState({ type: 'about' }, "", "/about");
        });
    }
}

function loadAboutPage() {
    const container = document.getElementById('container');
    container.className = 'container about';
    container.innerHTML = `
        <div>
        <h1>About<h1>
        <h2>English<h2>
        <p>This website is developed by Walker Yslan Viani with the objective of developing knowledge of CSS, HTML, JavaScript and Spring Boot.<p>
        </br>
        <h2>Portuguese<h2>
        <p>Esse site é desenvolvido por Walker Yslan Viani com o objetivo de desenvolver conhecimentos de CSS, HTML, JavaScript e Spring Boot.<p>
        </div>
        `;
}

function loginPage() {
    const button = document.getElementById('loginButton');
    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            loadLoginPage();
            history.pushState({ type: 'login' }, "", "/login");
        });
    }
}

function loadLoginPage() {
    const container = document.getElementById('container');
    container.className = "container login";
            container.innerHTML = `
            <div>
             <h1 id="loginTitle">Login</h1>
             <label id="alert" style="color:red"></label>
             <form>
             <label for="email">E-mail</label>
             <input type="email" id="email">
             <label for="password">Password</label>
             <input type="password" id="password" required>
             <input type="button" class="loginbutton" value="Login">
             </form>
             <input type="button" class="accountButton" value="Create new Account">
            </div>
            `;
}


document.addEventListener("DOMContentLoaded", () => {

    history.replaceState({ type: 'home' }, "", window.location.href);

    showAllProducts();
    showCategoryMenu();
    findClothesByName();
    findByCategoryName();
    mainPageShortcut();
    aboutPage();
    loginPage();

    window.addEventListener("popstate", (event) => {
        const state = event.state;

        if (!state || state.type === 'home') {
            showAllProducts();
            return;
        }
        if (state.type === 'about') {
            loadAboutPage();
            return;
        }
        if (state.type === 'login') {
            loadLoginPage();
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