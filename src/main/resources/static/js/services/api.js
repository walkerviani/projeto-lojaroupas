import { BASE_URL, updateAlert } from "../utils/util.js";
import {updateProductForm, updateUserForm} from "../modules/validations.js";

export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function postOrder(orderObj) {
    try {
        const response = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderObj)
        });
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export async function deleteData(url, alert) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            updateAlert(alert, "Deleted successfully!", "green");
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete");
        }
    } catch (error) {
        updateAlert(alert, error.message, "red");
    }
}

export async function sendAccountData(userData, alert, form) {
    try {
        updateAlert(alert, "Creating account...", "blue");

        const response = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            updateAlert(alert, "Account created successfully!", "green");
            form.reset();
            setTimeout(() => navigateTo('/login'), 2000);
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error creating user. Check if your data already exists");
        }
    } catch (error) {
        console.error("Error: ", error);
        updateAlert(alert, error.message, "red");
    }
}

export async function sendProductData(isUpdateMode, product, file, alert, form, productId) {
    try {
        //image upload
        if (file) {
            const imageFormData = new FormData();
            imageFormData.append('image', file);

            const imageResponse = await fetch(`${BASE_URL}/image`, {
                method: 'POST',
                body: imageFormData
            });
            if (!imageResponse.ok) throw new Error("Failed to upload image");

            const fileName = await imageResponse.text();

            product.imageData = {
                name: fileName.trim()
            }
        }
        const method = isUpdateMode ? 'PUT' : 'POST';
        const url = isUpdateMode ? `${BASE_URL}/clothes/${productId}` : `${BASE_URL}/clothes`;
        const productResponse = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (productResponse.ok) {
            const message = isUpdateMode ? "Product updated successfully!" : "Product created successfully!";
            updateAlert(alert, message, "green");

            if (isUpdateMode) {
                const imagePreview = document.getElementById('image-preview');
                const productInput = await fetchData(`${BASE_URL}/clothes/${productId}`)
                updateProductForm(form, productInput, imagePreview);
            } else {
                form.reset();
            }

        } else {
            throw new Error(isUpdateMode ? "Failed to upload" : "Failed to create");
        }
    } catch (error) {
        updateAlert(alert, error.message, "red");
    }
}

export async function sendCategoryData(obj, alert, form, id) {
    const isUpdateMode = id ? true : false;
    const method = isUpdateMode ? 'PUT' : 'POST';
    const url = isUpdateMode ? `${BASE_URL}/category/${id}` : `${BASE_URL}/category`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })

        if (response.ok) {
            const message = isUpdateMode ? "Category updated successfully!" : "Category created successfully!";
            updateAlert(alert, message, "green");
            form.reset();
        } else {
            throw new Error(isUpdateMode ? "Failed to update" : "Failed to create");
        }
    } catch (error) {
        updateAlert(alert, error.message, "red");
    }
}

export async function sendUserData(obj, password, alert, form, id) {
    const isUpdateMode = id ? true : false;
    const method = isUpdateMode ? 'PUT' : 'POST';
    const url = isUpdateMode ? `${BASE_URL}/users/${id}` : `${BASE_URL}/users`;

    try {
        if (isUpdateMode && password.value !== "") {
            const passwordResponse = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(password.value)
            });
            if (!passwordResponse.ok) throw new Error("Failed to update password");
        }

        if (!isUpdateMode) {
            obj.password = password.value;
        }
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })

        if (response.ok) {
            const message = isUpdateMode ? "User updated successfully!" : "User created successfully!";
            updateAlert(alert, message, "green");

            if (isUpdateMode) {
                const user = await fetchData(`${BASE_URL}/users/${id}`);
                updateUserForm(form, user);
            } else {
                form.reset();
            }

        } else {
            throw new Error(isUpdateMode ? "Failed to update" : "Failed to create");
        }
    } catch (error) {
        updateAlert(alert, error.message, "red");
    }
}