// Gerenciamento do carrinho - Preparado para integração com API PHP
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartBadge();
    showToast('Produto adicionado ao carrinho!', 'success');
}

// Atualizar quantidade
function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart();
        updateCartBadge();
        showToast('Quantidade atualizada', 'success');
    }
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    showToast('Item removido do carrinho', 'success');
}

// Salvar carrinho
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Atualizar badge do carrinho
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

// Calcular totais
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 29.99 : 0;
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
}

// Inicializar
updateCartBadge();