import { BASE_URL } from "../../config.js";

export async function authenticateUser(obj) {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj),
            credentials: "include"
        });
        const messageData = await response.json();
        if(response.ok) {
            return { 
                success: true, 
                message: messageData.message
            }
        }
        return { 
            success: false, 
            message: messageData.message
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export async function deauthenticateUser() {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: "include"
        });
        if(response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export async function checkAuth() {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/check`, {
            method: 'GET',
            credentials: "include"
        });
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            throw new Error("You need to be logged in");
        }
    } catch (error) {
        return null;
    }
}