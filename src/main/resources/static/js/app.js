import { handleRoute, navigateTo } from './components/router.js';
import { BASE_URL, fetchData, getCategoriesMenu } from './components/util.js';


async function setupNavigation() {

    // Category menu 
    const menu = document.getElementById('categoriesMenu');
    document.getElementById('categoriesButton').addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = getComputedStyle(menu).display === "none";
        menu.style.display = isHidden ? "block" : "none";
    });

    // Category options
    const categoriesRequest = await fetchData(`${BASE_URL}/category`);
    const categories = getCategoriesMenu(categoriesRequest);

    for (let category of categories) {
        const element = document.getElementById(`${category.name}-menu`);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                menu.style.display = "none"; // close the menu after choosing
                navigateTo(`/?category=${category.name}`);
            });
        }
    }


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