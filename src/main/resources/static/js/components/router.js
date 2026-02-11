import { BASE_URL, getProducts } from './util.js';
import * as UI from './ui.js';

export async function handleRoute() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const container = document.getElementById('container');

    //reset container classes
    if (container) {
        container.className = 'container';
        container.innerHTML = "";
    }

    if (params.has('id')) { // products by id
        const id = params.get('id');
        const product = await getProducts(`${BASE_URL}/clothes/${id}`);
        UI.showProductDetail(product);
    } else if (params.has('category')) { // products by category
        const category = params.get('category');
        const products = await getProducts(`${BASE_URL}/clothes/category?category=${category}`);
        UI.showProducts(products);
    } else if (params.has('name')) { // products by name (search)
        const queryName = params.get('name');
        const products = await getProducts(`${BASE_URL}/clothes/name?name=${queryName}`);
        UI.showProducts(products);
    } else if (path === '/admin-products') {
        UI.loadAdminProductsPage();
    } else if (path === '/admin-create-product') {
        UI.createProducts();
    } else if (path === '/admin-read-product') {
        UI.readProducts();
    } else if (path === '/admin-categories') {
        UI.loadAdminCategoriesPage();
    } else if (path === '/admin-create-category') {
        UI.createCategories();
    } else if (path === '/admin-read-category') {
        UI.readCategories();
    } else if (path === '/about') { // about page
        UI.loadAboutPage();
    } else if (path === '/signup') { // sign up page
        UI.loadCreateAccount();
    } else if (path === '/admin') { // admin page
        UI.loadAdminPage();
    } else if (path === '/login') { // login page
        UI.loadLoginPage();
    } else if (path === '/' || path === 'index.html') { // home page
        const products = await getProducts(`${BASE_URL}/clothes`);
        UI.showProducts(products);
    } else {
        UI.loadError404(); // 404 page not foun
    }
}

export function navigateTo(url) {
    history.pushState(null, "", url);
    handleRoute();
}