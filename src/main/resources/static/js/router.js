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

    if (params.has('id')) {
        const id = params.get('id');
        const product = await getProducts(`${BASE_URL}/clothes/${id}`);
        UI.showProductDetail(product);
    } else if (params.has('category')) {
        const category = params.get('category');
        const products = await getProducts(`${BASE_URL}/clothes/category?category=${category}`);
        UI.showProducts(products);
    } else if (params.has('name')) {
        const queryName = params.get('name');
        const products = await getProducts(`${BASE_URL}/clothes/name?name=${queryName}`);
        UI.showProducts(products);
    } else if (path === '/about') {
        UI.loadAboutPage();
    } else if (path === '/signup') {
        UI.loadCreateAccount();
    } else if (path === '/admin') {
        UI.loadAdminPage();
    }else if (path === '/login') {
        UI.loadLoginPage();
    }else {
        //home page
        const products = await getProducts(`${BASE_URL}/clothes`);
        UI.showProducts(products);
    }
}

export function navigateTo(url) {
    history.pushState(null, "", url);
    handleRoute();
}