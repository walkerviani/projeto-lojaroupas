import * as UTIL from './util.js';
import * as UI from './ui.js';

const routes = {
    '/admin/products': UI.loadProductsPage,
    '/admin/products/create': UI.createProduct,
    '/admin/products/update' : UI.updateProduct,
    '/admin/products/delete' : UI.deleteProduct,
    '/admin/categories': UI.loadCategoriesPage,
    '/admin/categories/create': UI.createCategory,
    '/admin/categories/update': UI.updateCategory,
    '/admin/categories/delete' : UI.deleteCategory,
    '/admin/users' : UI.loadUsersPage,
    '/admin/users/create' : UI.createUser,
    '/admin/users/update' : UI.updateUser,
    '/admin/users/delete' : UI.deleteUser,
    '/product' : UI.showProductDetail,
    '/about': UI.loadAboutPage,
    '/signup': UI.loadCreateAccount,
    '/admin': UI.loadAdminPage,
    '/login': UI.loadLoginPage,
    '/': UI.loadIndex,
    '/index.html': UI.loadIndex
}

export async function handleRoute() {
    const path = window.location.pathname;

    const container = document.getElementById('container');
    if (container) {
        container.className = 'container';
        container.innerHTML = "";
    }
    
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