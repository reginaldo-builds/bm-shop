// Página de detalhes do produto
const API_URL = 'http://localhost:8000/api';

async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/get.php?id=${productId}`);
        const product = await response.json();
        
        if (!product || product.message) {
            showToast('Produto não encontrado', 'error');
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }
        
        renderProductDetail(product);
        updateBreadcrumb(product);
        loadRelatedProducts(product.category_id);
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        showToast('Erro ao carregar produto', 'error');
    }
}

function renderProductDetail(product) {
    const container = document.getElementById('productDetail');
    const images = product.images && product.images.length > 0 ? product.images : [{ image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', is_primary: true }];
    const primaryImage = images.find(img => img.is_primary) || images[0];
    
    container.innerHTML = `
        <div class="product-images">
            <div class="main-image">
                <img src="${primaryImage.image_url}" alt="${product.name}" id="mainImage">
            </div>
            ${images.length > 1 ? `
                <div class="image-thumbnails">
                    ${images.map(img => `
                        <img src="${img.image_url}" 
                             alt="${product.name}" 
                             class="thumbnail ${img.is_primary ? 'active' : ''}"
                             onclick="changeMainImage('${img.image_url}', this)">
                    `).join('')}
                </div>
            ` : ''}
        </div>
        
        <div class="product-info">
            <h1>${product.name}</h1>
            <div class="category-badge">${product.category_name || 'Sem categoria'}</div>
            
            <div class="product-price">
                ${product.old_price ? `<span class="old-price">R$ ${parseFloat(product.old_price).toFixed(2)}</span>` : ''}
                <span class="price">R$ ${parseFloat(product.price).toFixed(2)}</span>
                ${product.discount > 0 ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
            </div>
            
            <div class="stock-info ${product.stock < 10 ? 'stock-low' : ''}">
                ${product.stock > 0 ? `${product.stock} unidades disponíveis` : 'Produto esgotado'}
            </div>
            
            ${product.description ? `
                <div class="product-description">
                    <h2>Descrição</h2>
                    <p>${product.description}</p>
                </div>
            ` : ''}
            
            <div class="product-actions">
                <div class="quantity-selector">
                    <button onclick="changeQuantity(-1)">-</button>
                    <input type="number" id="quantity" value="1" min="1" max="${product.stock}" readonly>
                    <button onclick="changeQuantity(1)">+</button>
                </div>
                <button class="btn-primary" onclick="addToCartFromDetail(${product.id}, '${product.name}', ${product.price}, '${primaryImage.image_url}', ${product.stock})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
}

function changeMainImage(imageUrl, thumbnail) {
    document.getElementById('mainImage').src = imageUrl;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

function changeQuantity(delta) {
    const input = document.getElementById('quantity');
    const newValue = parseInt(input.value) + delta;
    const max = parseInt(input.max);
    
    if (newValue >= 1 && newValue <= max) {
        input.value = newValue;
    }
}

function addToCartFromDetail(id, name, price, image, stock) {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (quantity > stock) {
        showToast('Quantidade não disponível em estoque', 'error');
        return;
    }
    
    addToCart(id, name, price, image, quantity);
}

function updateBreadcrumb(product) {
    document.getElementById('breadcrumbProduct').textContent = product.name;
}

async function loadRelatedProducts(categoryId) {
    if (!categoryId) return;
    
    try {
        const response = await fetch(`${API_URL}/products/get.php`);
        const allProducts = await response.json();
        
        const related = allProducts
            .filter(p => p.category_id == categoryId && p.id != new URLSearchParams(window.location.search).get('id'))
            .slice(0, 4);
        
        if (related.length > 0) {
            const container = document.getElementById('relatedProducts');
            const grid = document.getElementById('relatedGrid');
            
            grid.innerHTML = related.map(p => {
                const image = p.primary_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500';
                return `
                    <div class="product-card">
                        <a href="produto.html?id=${p.id}">
                            <img src="${image}" alt="${p.name}">
                        </a>
                        <div class="product-card-content">
                            <h3><a href="produto.html?id=${p.id}">${p.name}</a></h3>
                            <p class="category">${p.category_name || 'Sem categoria'}</p>
                            <div class="price">
                                ${p.old_price ? `<span class="old-price">R$ ${parseFloat(p.old_price).toFixed(2)}</span>` : ''}
                                <span class="current-price">R$ ${parseFloat(p.price).toFixed(2)}</span>
                            </div>
                            <button class="btn-primary" onclick="event.preventDefault(); addToCart(${p.id}, '${p.name}', ${p.price}, '${image}', 1)">
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            container.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar produtos relacionados:', error);
    }
}

loadProductDetail();
