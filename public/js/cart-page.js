// Renderizar itens do carrinho
function renderCartItems() {
    const container = document.getElementById('cartItems');
    const { subtotal, shipping, total } = calculateTotals();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="card empty-cart">
                <p>Seu carrinho está vazio</p>
                <a href="index.html" class="btn btn-primary">Continuar Comprando</a>
            </div>
        `;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="card cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-content">
                    <div>
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1}); renderCartItems();">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1}); renderCartItems();">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id}); renderCartItems();">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Remover
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `R$ ${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
}

renderCartItems();