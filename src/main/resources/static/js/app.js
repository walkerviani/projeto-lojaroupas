async function getProducts() {
    try {
        const response = await fetch('http://localhost:8080/clothes');
        return await response.json();
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

async function displayAllProducts() {
    const products = await getProducts();
    const grid = document.getElementById('productGrid');

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

function categoriesDisplay() {
    const button = document.getElementById('categoriesButton');
    const menu = document.getElementById('categoriesMenu');

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = getComputedStyle(menu).display === "none";
        menu.style.display = isHidden ? "block" : "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayAllProducts();
    categoriesDisplay();
});