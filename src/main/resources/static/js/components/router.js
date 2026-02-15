import * as UTIL from './util.js';
import * as UI from './ui.js';

const routes = {
    '/admin/products': UI.loadProductsPage,
    '/admin/products/create-product': UI.createProducts,
    '/admin/products/read-product': UI.readProducts,
    '/admin/categories': UI.loadCategoriesPage,
    '/admin/categories/create': UI.createCategory,
    '/admin/categories/update': UI.updateCategory,
    '/admin/categories/delete' : UI.deleteCategory,
    '/about': UI.loadAboutPage,
    '/signup': UI.loadCreateAccount,
    '/admin': UI.loadAdminPage,
    '/login': UI.loadLoginPage,
    '/': UI.loadIndex,
    '/index.html': UI.loadIndex
}

async function handleQueryParams(params) {
    if (params.has('id')) { // products by id
        const id = params.get('id');
        const product = await UTIL.getProducts(`${UTIL.BASE_URL}/clothes/${id}`);
        UI.showProductDetail(product);
        return true;
    }

    if (params.has('category')) { // products by category
        const category = params.get('category');
        const products = await UTIL.getProducts(`${UTIL.BASE_URL}/clothes/category?category=${category}`);
        UI.showProducts(products);
        return true;
    }

    if (params.has('name')) { // products by name (search)
        const queryName = params.get('name');
        const products = await UTIL.getProducts(`${UTIL.BASE_URL}/clothes/name?name=${queryName}`);
        UI.showProducts(products);
        return true;
    }

    if(params.has('update-id')) {
        const updateId = params.get('update-id');
        const category = await UTIL.getCategories(`${UTIL.BASE_URL}/category/${updateId}`);
        UI.updateCategory(category);
        return true;
    }

    if(params.has('delete-id')) {
        const deleteId = params.get('delete-id');
        const category = await UTIL.getCategories(`${UTIL.BASE_URL}/category/${deleteId}`);
        UI.deleteCategory(category);
        return true;
    }

    return false; //No parameters found 
}

export async function handleRoute() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    const container = document.getElementById('container');
    if (container) {
        container.className = 'container';
        container.innerHTML = "";
    }
    
    //If the route is not fixed, check if it is a search with parameters
    const hasParams = await handleQueryParams(params);
    if (hasParams) return;

    const routeAction = routes[path];
    if (routeAction) {
        await routeAction();
        return;
    }
    
    //If the route is not fixed and does not have valid parameters -> error 404
    UI.loadError404();
}

export function navigateTo(url) {
    history.pushState(null, "", url);
    handleRoute();
}