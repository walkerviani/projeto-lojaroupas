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
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error);
    }
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

export function getCategoriesMenu(categories) {
    let list = "";
    for (let category of categories) {
        list += `<li><a href="/" id="${category.name}-menu">${category.name}</a></li>`;
    }
    document.getElementById('categoriesMenu').innerHTML = list;
    return categories;
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


export function showProductTable(products) {
    let table = `
    <tr>
        <td>ID</td>
        <td>Name</td>
        <td>Price</td>
        <td>Description</td>
        <td>Size</td>
        <td>Color</td>
        <td></td>
        <td></td>
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
          <td class="table-update-button"><button name="update" data-id="${product.id}" class="update-button">Update</button></td>
          <td class="table-delete-button"><button name="delete" data-id="${product.id}" class="delete-button">Delete</button></td>
        </tr>
        `;
    }
    document.getElementById('product-table').innerHTML = table;
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
          <td class="table-update-button"><button name="update" data-id="${category.id}" class="update-button">Update</button></td>
          <td class="table-delete-button"><button name="delete" data-id="${category.id}" class="delete-button">Delete</button></td>
        </tr>
        `;
    }
    document.getElementById('category-table').innerHTML = table;
}



export async function deleteCategories(id, alert) {
    try {
        const response = await fetch(`${BASE_URL}/category/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 

        if(response.ok){
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
            alert.style.color = "green";
            alert.textContent = "Category deleted successfully!";
        }else {
            const errorData = await response.json();
            console.log(errorData);
            throw new Error(errorData.error || "Failed to delete");
        }
    } catch (error) {
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
        alert.style.color = "red";
        alert.textContent = error.message;
    }
}