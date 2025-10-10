// Admin CRM - Gerenciamento completo
const API_URL = 'http://localhost:8000/api';
let adminProducts = [];
let categories = [];
let orders = [];
let users = [];
let editingId = null;
let productImages = [];

// Navegação entre tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
    });
});

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(tab).classList.add('active');
    
    if (tab === 'dashboard') loadDashboard();
    else if (tab === 'products') loadProducts();
    else if (tab === 'categories') loadCategories();
    else if (tab === 'orders') loadOrders();
    else if (tab === 'users') loadUsers();
}

// Dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/stats/dashboard.php`);
        const stats = await response.json();
        
        document.getElementById('totalProducts').textContent = stats.total_products;
        document.getElementById('totalOrders').textContent = stats.total_orders;
        document.getElementById('totalUsers').textContent = stats.total_users;
        document.getElementById('totalRevenue').textContent = `R$ ${parseFloat(stats.total_revenue || 0).toFixed(2)}`;
        
        const tbody = document.getElementById('recentOrdersTable');
        tbody.innerHTML = (stats.recent_orders || []).map(o => `
            <tr>
                <td>#${o.id}</td>
                <td>${o.customer_name || 'N/A'}</td>
                <td>R$ ${parseFloat(o.total_amount).toFixed(2)}</td>
                <td>${o.status}</td>
                <td>${new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories/get.php`);
        categories = await response.json();
        renderCategorySelect();
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products/get.php`);
        adminProducts = await response.json();
        renderAdminProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function renderCategorySelect() {
    const select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Selecione uma categoria</option>' +
        categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function renderAdminProducts() {
    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = adminProducts.map(p => `
        <tr>
            <td><img src="${p.primary_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200'}" alt="${p.name}" class="product-thumbnail"></td>
            <td>${p.name}</td>
            <td>${p.category_name || 'Sem categoria'}</td>
            <td style="color: hsl(var(--primary)); font-weight: 600;">R$ ${parseFloat(p.price).toFixed(2)}</td>
            <td class="${p.stock < 10 ? 'stock-low' : ''}">${p.stock} un.</td>
            <td class="text-right">
                <div class="action-btns">
                    <button class="btn-icon" onclick="editProduct(${p.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteProduct(${p.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openModal(title = 'Adicionar Novo Produto') {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('productModal').classList.add('active');
    document.getElementById('saveBtn').textContent = editingId ? 'Atualizar' : 'Adicionar';
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
    editingId = null;
    productImages = [];
    renderImagesList();
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/get.php?id=${id}`);
        const product = await response.json();
        
        if (!product) return;
        
        editingId = id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOldPrice').value = product.old_price || '';
        document.getElementById('productCategory').value = product.category_id || '';
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDiscount').value = product.discount || 0;
        
        productImages = product.images || [];
        renderImagesList();
        
        openModal('Editar Produto');
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        showToast('Erro ao carregar produto', 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
        const response = await fetch(`${API_URL}/products/delete.php`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        showToast(result.message, response.ok ? 'success' : 'error');
        
        if (response.ok) {
            await loadProducts();
        }
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        showToast('Erro ao deletar produto', 'error');
    }
}

function addImageUrl() {
    const input = document.getElementById('imageUrlInput');
    const url = input.value.trim();
    
    if (!url) {
        showToast('Digite uma URL válida', 'error');
        return;
    }
    
    productImages.push({
        image_url: url,
        is_primary: productImages.length === 0,
        order_position: productImages.length
    });
    
    input.value = '';
    renderImagesList();
}

function removeImage(index) {
    productImages.splice(index, 1);
    productImages.forEach((img, i) => {
        img.order_position = i;
        if (i === 0) img.is_primary = true;
    });
    renderImagesList();
}

function setPrimaryImage(index) {
    productImages.forEach((img, i) => {
        img.is_primary = (i === index);
    });
    renderImagesList();
}

function renderImagesList() {
    const container = document.getElementById('imagesList');
    if (productImages.length === 0) {
        container.innerHTML = '<p style="color: #666;">Nenhuma imagem adicionada</p>';
        return;
    }
    
    container.innerHTML = productImages.map((img, index) => `
        <div class="image-item">
            <img src="${img.image_url}" alt="Imagem ${index + 1}">
            <div class="image-actions">
                ${img.is_primary ? '<span class="primary-badge">Principal</span>' : 
                  `<button type="button" class="btn-small" onclick="setPrimaryImage(${index})">Definir como principal</button>`}
                <button type="button" class="btn-icon delete" onclick="removeImage(${index})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

document.getElementById('addProductBtn').addEventListener('click', () => openModal());
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('addImageBtn').addEventListener('click', addImageUrl);

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        old_price: document.getElementById('productOldPrice').value ? parseFloat(document.getElementById('productOldPrice').value) : null,
        category_id: parseInt(document.getElementById('productCategory').value),
        stock: parseInt(document.getElementById('productStock').value) || 0,
        discount: parseInt(document.getElementById('productDiscount').value) || 0,
        images: productImages.map(img => img.image_url)
    };
    
    try {
        let response;
        if (editingId) {
            productData.id = editingId;
            response = await fetch(`${API_URL}/products/update.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            // Atualizar imagens
            await updateProductImages(editingId);
        } else {
            response = await fetch(`${API_URL}/products/create.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }
        
        const result = await response.json();
        showToast(result.message, response.ok ? 'success' : 'error');
        
        if (response.ok) {
            await loadProducts();
            closeModal();
        }
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showToast('Erro ao salvar produto', 'error');
    }
});

async function updateProductImages(productId) {
    // Remover imagens antigas
    const existingResponse = await fetch(`${API_URL}/products/images.php?product_id=${productId}`);
    const existingImages = await existingResponse.json();
    
    for (const img of existingImages) {
        await fetch(`${API_URL}/products/images.php`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: img.id })
        });
    }
    
    // Adicionar novas imagens
    for (const img of productImages) {
        await fetch(`${API_URL}/products/images.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productId,
                image_url: img.image_url,
                is_primary: img.is_primary,
                order_position: img.order_position
            })
        });
    }
}

// Pedidos
async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/get.php`);
        orders = await response.json();
        const tbody = document.getElementById('ordersTable');
        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>#${o.id}</td>
                <td>${o.customer_name || 'N/A'}</td>
                <td>${o.customer_email || 'N/A'}</td>
                <td>R$ ${parseFloat(o.total_amount).toFixed(2)}</td>
                <td>${o.status}</td>
                <td>${new Date(o.created_at).toLocaleDateString()}</td>
                <td class="text-right"><button class="btn-icon">👁️</button></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Usuários
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users/get.php`);
        users = await response.json();
        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${new Date(u.created_at).toLocaleDateString()}</td>
                <td class="text-right">
                    <button class="btn-icon delete" onclick="deleteUser(${u.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function deleteUser(id) {
    if (!confirm('Confirmar exclusão?')) return;
    await fetch(`${API_URL}/users/delete.php`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
    });
    loadUsers();
}

loadDashboard();
