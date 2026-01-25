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
    const products = await getProducts('http://localhost:8080/clothes');
    displayProducts(products);
}

function categoriesDisplay() {
    const button = document.getElementById('categoriesButton');
    const menu = document.getElementById('categoriesMenu');

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = getComputedStyle(menu).display === "none";
        menu.style.display = isHidden ? "block" : "none";
    });
}

async function findClothesByName() {
    document.getElementById('searchButton').addEventListener('click', async() => {
        const searchValue = document.getElementById('searchInput').value.trim();
        if(!searchValue) return; 
        const url = `http://localhost:8080/clothes/name?name=${encodeURIComponent(searchValue)}`;
        const products = await getProducts(url);
        displayProducts(products);
    })

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
    categoriesDisplay();
    findClothesByName();
});