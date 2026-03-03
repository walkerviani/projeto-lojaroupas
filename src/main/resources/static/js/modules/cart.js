import {currencyFormatterToBRL} from '../utils/util.js';

export function getCartItems() {
    const cart = localStorage.getItem('cart');
    if (cart) {
        try {
            const parsedCart = JSON.parse(cart);
            return Array.isArray(parsedCart) ? parsedCart : [];
        } catch (error) {
            return [];
        }
    }
    return [];
}

function saveCartItems(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(product) {
    try {
        const cart = getCartItems();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += product.quantity;
        }
        else {
            cart.push(product);
        }
        saveCartItems(cart);
        return true;
    } catch (error) {
        return false;
    }
}

export function updateQuantity(productId, newQuantity) {
    const cart = getCartItems();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCartItems(cart);
    }
}

export function removeFromCart(productId) {
    const cart = getCartItems();
    const updateCart = cart.filter(item => item.id !== productId);
    saveCartItems(updateCart);
}

export function clearCart() {
    localStorage.removeItem('cart');
}

export function renderCart() {
    const cart = getCartItems();
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    cartItemsElement.innerHTML = '';

    if (cart.length === 0) {
        cartItemsElement.textContent = 'No items in cart';
        cartTotalElement.textContent = 'Total: R$ 0.00';
        return;
    }

    let cartTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
        <img src="${item.imageUrl}"}>
        <div class="cart-content">
          <p>${item.name} - ${currencyFormatterToBRL(item.price)}</p>
          <div>
           <button class="quantity-controls decrease-qnt" data-id="${item.id}">-</button>
           <span>Quantity: ${item.quantity}</span>
           <button class="quantity-controls increase-qnt" data-id="${item.id}">+</button>
          </div>
        <p>Item total: ${currencyFormatterToBRL(itemTotal)}</p>
        <button class="remove-item-button remove-item" data-id="${item.id}">Remove</button>
        </div>
        `;

        cartItemsElement.appendChild(itemElement);
    });

    cartTotalElement.textContent = `Total: ${currencyFormatterToBRL(cartTotal)}`;
}

export function renderProductsList() {
    const cart = getCartItems();

    const checkoutitemsElement = document.getElementById('checkout-items');
    const checkoutTotalElement = document.getElementById('checkout-total');

    checkoutitemsElement.innerHTML = '';
    checkoutitemsElement.textContent = "Items";

    let cartTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.classList.add('checkout-item');
        itemElement.innerHTML = `
        <img src="${item.imageUrl}">
        <div class="cart-content">
          <p>${item.name} - ${currencyFormatterToBRL(item.price)}</p>
          <p>Item total: ${currencyFormatterToBRL(itemTotal)}</p>
        </div>
        `;

        checkoutitemsElement.appendChild(itemElement);
    });
    
    const divider = document.createElement('div');
    divider.classList.add('checkout-divider');
    checkoutitemsElement.appendChild(divider);

    checkoutTotalElement.textContent = `Total: ${currencyFormatterToBRL(cartTotal)}`;
}