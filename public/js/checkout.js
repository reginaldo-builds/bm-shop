// Atualizar resumo do checkout
const { subtotal, shipping, total } = calculateTotals();
const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

document.getElementById('checkoutSubtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
document.getElementById('checkoutShipping').textContent = `R$ ${shipping.toFixed(2)}`;
document.getElementById('checkoutTotal').textContent = `R$ ${total.toFixed(2)}`;
document.querySelector('.summary-row span').textContent = `Subtotal (${itemCount} itens)`;

// Form de checkout
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('confirmBtn');
    btn.textContent = 'Processando...';
    btn.disabled = true;
    
    setTimeout(() => {
        showToast('Pedido realizado com sucesso!', 'success');
        cart = [];
        saveCart();
        setTimeout(() => window.location.href = 'index.html', 1000);
    }, 2000);
});

// Mostrar/esconder campos de cartão
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const cardFields = document.getElementById('creditCardFields');
        cardFields.style.display = e.target.value === 'credit-card' ? 'flex' : 'none';
    });
});