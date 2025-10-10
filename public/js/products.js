// Dados dos produtos - Será substituído por API PHP
const products = [
    {
        id: 1,
        name: "Sistema ERP Completo",
        price: 2499.99,
        oldPrice: 3499.99,
        category: "Gestão Empresarial",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
        stock: 15,
        discount: 30
    },
    {
        id: 2,
        name: "Plataforma E-commerce Pro",
        price: 1999.99,
        oldPrice: 2999.99,
        category: "E-commerce",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500",
        stock: 12,
        discount: 35
    },
    {
        id: 3,
        name: "Sistema PDV Avançado",
        price: 899.99,
        oldPrice: 1299.99,
        category: "PDV & Vendas",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
        stock: 25,
        discount: 30
    },
    {
        id: 4,
        name: "Software de Gestão Financeira",
        price: 1499.99,
        category: "Gestão Empresarial",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500",
        stock: 20
    },
    {
        id: 5,
        name: "Sistema de Controle de Estoque",
        price: 799.99,
        category: "Automação Comercial",
        image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=500",
        stock: 18
    },
    {
        id: 6,
        name: "Plataforma CRM Empresarial",
        price: 1899.99,
        category: "Gestão Empresarial",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500",
        stock: 10
    }
];

// Renderizar produtos
function renderProducts() {
    const promoContainer = document.getElementById('promoProducts');
    const catalogContainer = document.getElementById('catalogProducts');
    
    if (!promoContainer || !catalogContainer) return;
    
    // Produtos em promoção
    const promoProducts = products.filter(p => p.discount);
    promoContainer.innerHTML = promoProducts.map(product => createProductCard(product)).join('');
    
    // Catálogo completo
    catalogContainer.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Criar card de produto
function createProductCard(product) {
    return `
        <div class="card product-card">
            <div style="position: relative;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.discount ? `<span class="product-badge">-${product.discount}%</span>` : ''}
            </div>
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-prices">
                    <span class="product-price">R$ ${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="product-old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="btn btn-primary btn-full" onclick="addToCart(${product.id})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderProducts);
} else {
    renderProducts();
}