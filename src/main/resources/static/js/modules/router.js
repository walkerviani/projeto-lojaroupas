import * as UI from '../components/ui.js';

const routes = {
    '/admin/products': UI.loadProductsPage,
    '/admin/products/create': UI.createProductPage,
    '/admin/products/update': UI.updateProductPage,
    '/admin/products/delete': UI.deleteProductPage,
    '/admin/categories': UI.loadCategoriesPage,
    '/admin/categories/create': UI.createCategoryPage,
    '/admin/categories/update': UI.updateCategoryPage,
    '/admin/categories/delete': UI.deleteCategoryPage,
    '/admin/users': UI.loadUserPage,
    '/admin/users/create': UI.createUserPage,
    '/admin/users/update': UI.updateUserPage,
    '/admin/users/delete': UI.deleteUserPage,
    '/admin/orders' : UI.loadOrdersPage,
    '/admin/orders/detail' : UI.loadOrderDetail,
    '/product': UI.showProductDetail,
    '/cart': UI.loadCartPage,
    '/checkout': UI.loadCheckout,
    '/my-purchases' : UI.loadUserPurchases,
    '/signup': UI.loadCreateAccountPage,
    '/profile' : UI.loadUserProfilePage,
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
    UI.loadError404Page();
}

export async function navigateTo(url) {
    history.pushState(null, "", url);
    handleRoute();
    await UI.updateAuthUI(); //update login button text to profile if the user is authenticated
}