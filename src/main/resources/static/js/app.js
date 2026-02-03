import { handleRoute, navigateTo } from './router.js';


function setupNavigation() {

    // Category menu 
    const menu = document.getElementById('categoriesMenu');
    document.getElementById('categoriesButton').addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = getComputedStyle(menu).display === "none";
        menu.style.display = isHidden ? "block" : "none";
    });

    // Category options
    const categories = ['shirt', 'skirt', 'coat'];
    categories.forEach(category => {
        document.getElementById(category).addEventListener('click', (e) => {
            e.preventDefault();
            menu.style.display = "none"; // close the menu after choosing
            navigateTo(`/?category=${category}`);
        });
    });

    //  Logo / home button shortcut
    document.getElementById('logo').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/');
    });

    //About page
    document.getElementById('aboutButton').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/about');
    });

    //Login page
    document.getElementById('loginButton').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/login');
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
}

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    handleRoute();
    window.addEventListener("popstate", () => {
        handleRoute();
    });
});