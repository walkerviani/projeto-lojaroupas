import { BASE_URL } from "../utils/util.js";

export async function fetchOrder(orderObj) {
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
        console.log("Fetch order error: ", error.message);
        return false;
    }
}