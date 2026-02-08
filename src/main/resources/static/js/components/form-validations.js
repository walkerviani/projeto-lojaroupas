import { navigateTo } from "./router.js";
import { BASE_URL } from "./util.js";

export function validateCreateAccount() {
    const form = document.getElementById('form-create-account');
    const { name, cpf, email, phone, password, confPassword } = form.elements;
    const alert = document.getElementById('alert');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; //allow normal and accented characters and whitespace
        const phoneRegex = /^\d{11}$/; //numeric number with 11 digits long

        //1. Reset the label and error
        alert.textContent = "";
        let error = "";

        if (name.validity.valueMissing) { // Name validation
            error = "Name is required!";
        } else if (name.validity.tooShort) {
            error = "Name is too short!";
        } else if (!nameRegex.test(name.value)) {
            error = "Name must not have numbers";
        } else if (cpf.validity.valueMissing) { // Cpf validation
            error = "CPF is required!";
        } else if(cpf.value.trim().length < 11){
            error = "CPF must have 11 digits";
        } else if (email.validity.valueMissing) { // Email validation
            error = "Email is required!";
        } else if (email.validity.typeMismatch) {
            error = "Please enter a valid email!";
        } else if (phone.validity.valueMissing) { // Phone validation
            error = "Phone is required!";
        } else if (!phoneRegex.test(phone.value)) {
            error = "Please enter a valid phone with DDD (11 digits)!";
        } else if (password.validity.valueMissing) { // Password validation
            error = "Password is required!";
        } else if (password.validity.tooShort) {
            error = "Password minimum size is 8";
        } else if (confPassword.validity.valueMissing) { // ConfPassword validation
            error = "Confirmation password is required!";
        } else if (confPassword.value != password.value) {
            error = "Passwords don't match";
        }

        if (error != "") {
            alert.textContent = error;
            alert.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            const userData = {
                name: name.value,
                cpf: cpf.value,
                email: email.value,
                phone: phone.value,
                password: password.value,
                role: "USER"
            }
            await sendAccountData(userData, alert, form);
        }
    });
}

async function sendAccountData(userData, alert, form) {
    try {
        alert.style.color = "blue";
        alert.textContent = "Creating account...";
        alert.scrollIntoView({ behavior: "smooth", block: "center" });

        const response = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert.style.color = "green";
            alert.textContent = "Account created successfully!";
            form.reset();
            setTimeout(() => navigateTo('/login'), 2000);
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error creating user. Check if your data already exists");
        }
    } catch (e) {
        console.error("Error: ", e);
        alert.style.color = "red";
        alert.textContent = e.message;
        alert.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}