import { handleRoute, navigateTo } from './modules/router.js';
import { BASE_URL, getCategoriesMenu } from './utils/util.js';
import { fetchData } from "./services/api.js";
import { checkAuth } from "./services/auth.js";
import { updateAuthUI } from "./components/ui.js";

async function setupNavigation() {

    //update login button text to profile if the user is authenticated
    await updateAuthUI();

    // Category menu 
    const menu = document.getElementById('categories-menu');
    const dropdown = document.getElementById('categories-dropdown');
    const categoryButton = document.getElementById('categories-button');

    //prevent click on 'categories' menu text
    categoryButton.addEventListener('click', (e) => {
        e.preventDefault();
    });

    menu.addEventListener('mouseenter', () => {
        dropdown.style.display = "block";
    });

    menu.addEventListener('mouseleave', () => {
        dropdown.style.display = "none";
    });

    // Category options
    const categoriesRequest = await fetchData(`${BASE_URL}/category`);
    const categories = getCategoriesMenu(categoriesRequest);

    for (let category of categories) {
        const element = document.getElementById(`${category.name}-menu`);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.style.display = "none"; // close the menu after choosing
                navigateTo(`/?category=${category.name}`);
            });
        }
    }


    //  Logo / home button shortcut
    document.getElementById('logo').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/');
    });

    //Login page
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const user = await checkAuth();
        if (!user) {
            navigateTo('/login');
        } else {
            navigateTo('/profile');
        }
    });

    //Search
    document.getElementById('searchButton').addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.getElementById('searchInput');
        const query = input.value.trim();
        if (query) {
            navigateTo(`/?name=${query}`);
        }
    });

    //Cart
    document.getElementById('shopping-cart').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/cart');
    });

    //Orders
    document.getElementById('orders-button').addEventListener('click', async (e) => {
        e.preventDefault();
        const user = await checkAuth();
        if (!user) {
            navigateTo('/login');
        } else {
            navigateTo('/my-purchases');
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    handleRoute();
    window.addEventListener("popstate", () => {
        handleRoute();
        updateAuthUI();
    });
});