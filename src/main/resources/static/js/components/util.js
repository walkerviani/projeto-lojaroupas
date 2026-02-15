export const BASE_URL = "http://localhost:8080";

export async function getProducts(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

    export async function getCategories(url) {
        try {
            const response = await fetch(url);
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error: ", error);
        }
    }

export function showProductTable(products) {
    let table = `
    <tr>
        <td>ID</td>
        <td>Name</td>
        <td>Price</td>
        <td>Description</td>
        <td>Size</td>
        <td>Color</td>
    </tr>`;

    for (let product of products) {
        table += `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.description}</td>
          <td>${product.size}</td>
          <td>${product.color}</td>
        </tr>
        `;
    }
    document.getElementById('product-table').innerHTML = table;
}

export function capitalizeFirstLetter(text) {
    const str = text.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function currencyFormatterToBRL(number) {
    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumSignificantDigits: 4
    });
}

export function createSelectCategories(categories, selectName) {
    const select = document.getElementById(selectName);
    for (let category of categories) {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    };
}

export function showCategoryTable(categories) {
    let table = `
    <tr>
        <td>ID</td>
        <td>Name</td>
        <td></td>
        <td></td>
    </tr>`;

    for (let category of categories) {
        table += `
        <tr>
          <td>${category.id}</td>
          <td>${category.name}</td>
          <td class="update-button"><button name="update" data-id="${category.id}" class="update-button">Update</button></td>
          <td class="delete-button"><button name="delete" data-id="${category.id}" class="delete-button">Delete</button></td>
        </tr>
        `;
    }
    document.getElementById('category-table').innerHTML = table;
}

export function getCategoriesMenu(categories){
    let list = "";
        for(let category of categories){
            list += `<li><a href="/" id="${category.name}-menu">${category.name}</a></li>`;
        }
        document.getElementById('categoriesMenu').innerHTML = list;
      return categories;
}