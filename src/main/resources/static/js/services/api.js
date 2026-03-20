import { BASE_URL } from "../utils/util.js";

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

export async function sendOrderData(orderObj, url, orderId) {
    const isUpdateMode = orderId != null;
    const method = isUpdateMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderObj)
        })
        const responseData = await response.json();
        if (response.ok) {
            return {
                success: true,
                message: isUpdateMode ? "Order updated successfully!" : "Order created successfully!"
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

export async function deleteData(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let responseData = null;
        if (response.status !== 204) {
            responseData = await response.json();
        }
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
        const response = await fetch(`${BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObj)
        });
        const responseData = await response.json();
        if (response.ok) {
            return {
                success: true,
                message: "Account created successfully!"
            }
        } else {
            return {
                success: false,
                message: responseData.message || "Error creating account"
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function sendProductData(productObj, file, productId) {
    const isUpdateMode = productId != null;
    try {
        // Image upload
        if (file) {
            const imageFormData = new FormData();
            imageFormData.append('image', file);

            const imageResponse = await fetch(`${BASE_URL}/api/admin/image`, {
                method: 'POST',
                body: imageFormData
            });
            const fileName = await imageResponse.text();
            if (!imageResponse.ok) {
                return {
                    success: false,
                    message: "Failed to upload image"
                }
            }
            // Set product image name 
            productObj.imageData = {
                name: fileName.trim()
            }
        }
        const method = isUpdateMode ? 'PUT' : 'POST';
        const url = isUpdateMode ? `${BASE_URL}/api/admin/products/${productId}` : `${BASE_URL}/api/admin/products`;
        const productResponse = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productObj)
        });
        const responseData = await productResponse.json();
        if (productResponse.ok) {
            return {
                success: true,
                message: isUpdateMode ? "Product updated successfully!" : "Product created successfully!"
            }

        } else {
            return {
                success: false,
                message: responseData.message || (isUpdateMode ? "Failed to update" : "Failed to create")
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function sendCategoryData(categoryObj, categoryId) {
    const isUpdateMode = categoryId != null;
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

export async function sendUserData(userObj, url, password, userId) {
    const isUpdateMode = userId != null;
    const method = isUpdateMode ? 'PUT' : 'POST';

    try {
        // Update password
        if (isUpdateMode && password != null && password.value.trim() !== "") {
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

export async function checkUserPassword(userId, password) {
    try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}/check-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(password)
        });
        if(!response.ok) {
            return {
                success: false,
                message: "Something went wrong. Try again"
            }
        }
        const isValid = await response.json();
        return {
            success: isValid,
            message: isValid ? "" : "Current password is incorrect"
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
        const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
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
        const response = await fetch(`${BASE_URL}/api/clothes/name?name=${encodeURIComponent(productName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const responseData = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: responseData.message
            }
        }
        return {
            success: true,
            data: responseData
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}