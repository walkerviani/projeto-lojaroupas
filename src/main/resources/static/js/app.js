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

async function allProductsDisplay() {
    const url = BASE_URL + "/clothes";
    const products = await getProducts(url);
    displayProducts(products);
}

function categoryMenuDisplay() {
    const button = document.getElementById('categoriesButton');
    const menu = document.getElementById('categoriesMenu');

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = getComputedStyle(menu).display === "none";
        menu.style.display = isHidden ? "block" : "none";
    });
}

async function findClothesByName() {
    document.getElementById('searchButton').addEventListener('click', async(e) => {
        e.preventDefault();
        const searchValue = document.getElementById('searchInput').value.trim();
        if(!searchValue) return; 
        const url = BASE_URL + `/clothes/name?name=${encodeURIComponent(searchValue)}`;
        const products = await getProducts(url);
        displayProducts(products);
    })

}

async function findByCategoryName() {
    const catURL = "/clothes/category?category=";
    document.getElementById('shirt').addEventListener('click', async (e) =>{
        e.preventDefault();
        const url = BASE_URL + catURL + "shirt";
        const products = await getProducts(url);
        displayProducts(products);
    });
    document.getElementById('skirt').addEventListener('click', async (e) =>{
        e.preventDefault();
        const url = BASE_URL + catURL + "skirt";
        const products = await getProducts(url);
        displayProducts(products);
    });
    document.getElementById('coat').addEventListener('click', async (e) =>{
        e.preventDefault();
        const url = BASE_URL + catURL + "coat";
        const products = await getProducts(url);
        displayProducts(products);
    });
}

function mainPage(){
    document.getElementById('logo').addEventListener('click', () => {
        window.location.href = BASE_URL;
    });
}

function displayProducts(products){
    const grid = document.getElementById('productGrid');
    grid.innerHTML = "";

    if(!products || products.length === 0){
        grid.innerHTML = "<p>No products found</p>";
        return;
    }
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
        <div class="card-image">
            <img src="${product.imageUrl}">
            </div >
            <div>
                <h3>${product.name}</h3>
                <p>R$ ${product.price.toFixed(2)}</p>
            </div>
            `;
        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    allProductsDisplay();
    categoryMenuDisplay();
    findClothesByName();
    findByCategoryName();
    mainPage();
});