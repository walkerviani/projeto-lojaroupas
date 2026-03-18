import { BASE_URL, updateAlert } from "../utils/util.js";
import { updateProductForm } from "../modules/validations.js";

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

export async function putOrder(orderObj) {
    try {
        const response = await fetch(`${BASE_URL}/orders/${orderObj.id}`, {
            method: 'PUT',
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

export async function deleteData(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const responseData = await response.json();
        if (response.ok) {
            return {
                success: true,
                message: "Deleted successfully!"
            }
        } else {
            return {
                success: false,
                message: responseData.message
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function sendAccountData(userObj) {
    try {
        const response = await fetch(`${BASE_URL}/api/admin/users`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObj)
        });

        if (response.ok) {
            return {
                success: true,
                message: "Account created successfully!"
            }
        } else {
            return {
                success: false,
                message: "Error creating user"
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
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

export async function sendCategoryData(categoryObj, categoryId) {
    const isUpdateMode = categoryId ? true : false;
    const method = isUpdateMode ? 'PUT' : 'POST';
    const url = isUpdateMode ? `${BASE_URL}/api/admin/categories/${categoryId}` : `${BASE_URL}/api/admin/categories`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryObj)
        })
        const responseData = await response.json();
        if (response.ok) {
            return {
                success: true,
                message: isUpdateMode ? "Category updated successfully!" : "Category created successfully!"
            }
        } else {
            return {
                success: false,
                message: responseData.message
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function sendUserData(userObj, password, userId) {
    const isUpdateMode = userId ? true : false;
    const method = isUpdateMode ? 'PUT' : 'POST';
    const url = isUpdateMode ? `${BASE_URL}/api/admin/users/${userId}` : `${BASE_URL}/api/admin/users`;

    try {
        // Update password
        if (isUpdateMode && password.value !== "") {
            const passwordResponse = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(password.value)
            });
            if (!passwordResponse.ok) {
                const responseData = await passwordResponse.json();
                return {
                    success: false,
                    message: responseData.message
                }
            }
        }

        if (!isUpdateMode) {
            userObj.password = password.value;
        }
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userObj)
        })
        const responseData = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                message: isUpdateMode ? "User updated successfully!" : "User created successfully!"
            }

        } else {
            return {
                success: false,
                message: responseData.message
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function putUser(obj, userId) {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        if (!response.ok) {
            const errorText = await response.text();
            return {
                message: errorText || "Update failed!",
                result: false
            };
        } else {
            return true;
        }
    } catch (error) {
        return {
            message: error.message,
            result: false
        };
    }
}

export async function checkUserPassword(userId, currentPassword) {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/check-password?password=${currentPassword}`, {
            method: 'POST',
        });
        if (!response.ok) {
            return {
                success: false,
                message: "current password is incorrect"
            }
        }
        const isValid = await response.json();
        return {
            success: isValid,
            message: ""
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function sendUserPassword(userId, password) {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(password)
        });

        if (response.ok) {
            return {
                success: true,
                message: "Password updated successfully!"
            }
        } else {
            return {
                success: false,
                message: "Failed to update your password. Try again!"
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function findProductByName(productName) {
    try {
        const response = await fetch(`${BASE_URL}/clothes/name?name=${encodeURIComponent(productName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const responseText = await response.text();
            return {
                success: false,
                message: responseText
            }
        }

        const data = await response.json();
        return {
            success: true,
            data: data
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}