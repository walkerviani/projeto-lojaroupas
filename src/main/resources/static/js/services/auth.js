import { BASE_URL } from "../utils/util.js";

export async function authenticateUser(obj) {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj),
            credentials: "include"
        });
        const message = await response.text();
        if(response.ok) {
            return { success: true, data: message }
        }
        return { success: false, data: message }
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

export async function deauthenticateUser() {
    try {
        const response = await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: "include"
        });
        if(response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Deauthentication error: ", error);
        return false;
    }
}

export async function checkAuth() {
    try {
        const response = await fetch(`${BASE_URL}/auth/check`, {
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