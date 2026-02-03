import { navigateTo } from "./router.js";
import { capitalizeFirstLetter, currencyFormatterToBRL } from "./util.js";

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

export function loadAboutPage() {
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

export function loadLoginPage() {
    const container = document.getElementById('container');
    container.className = "container form";
    container.innerHTML = `
            <div>
             <h1 class="formTitle">Login</h1>
             <label id="alert" style="color:red"></label>
              <form>
                <label for="email">E-mail</label>
                <input type="email" id="email">
                <label for="password">Password</label>
                <input type="password" id="password" required>
                <input type="submit" class="formbutton" value="Login">
              </form>
               <input type="button" id="createButton" class="greenButton" value="Create new Account">
            </div>
            `;
    document.getElementById('createButton').addEventListener('click', () => {
        navigateTo('/signup');
    })
}

export function loadCreateAccount() {
    const container = document.getElementById('container');
    container.className = "container form";
    container.innerHTML = `
            <div>
            <h1 class="formTitle">Create a new account</h1>
            <label id="alert" style="color:red"></label>
            <form>
            <label for="name">Name</label>
            <input type="text" id="name">
            <label for="email">Email</label>
            <input type="email" id="email">
            <label for="phone">Phone</label>
            <input type="tel" id="phone">
            <label for="password">Password</label>
            <input type="password" id="password" required>
            <label for="confPassword">Confirm your password</label>
            <input type="password" id="confPassword" required>
            <input type="submit" class="greenButton" value="Sign up">
            </form>
            </div>
            `;
}