# 📋 BM Sistemas - Guia de Configuração

## 🎯 Visão Geral

Este projeto possui:
- **Frontend**: HTML/CSS/JavaScript puro (pasta `public/`)
- **Backend**: API REST em PHP (pasta `api/`)
- **Banco de Dados**: MySQL

---

## 📦 Pré-requisitos

- **PHP 7.4+** com PDO MySQL
- **MySQL 5.7+** ou **MariaDB 10.3+**
- **Servidor Web** (Apache, Nginx ou PHP Built-in Server)

---

## 🗄️ Passo 1: Configurar Banco de Dados

### 1.1 Criar o Banco de Dados

Acesse o MySQL e execute o arquivo `database.sql`:

```bash
mysql -u root -p < database.sql
```

**OU** manualmente via phpMyAdmin:
1. Acesse phpMyAdmin
2. Clique em "Novo" para criar database
3. Cole o conteúdo do arquivo `database.sql`
4. Execute

### 1.2 Estrutura do Banco

O script criará automaticamente:

**Tabela: produtos**
- `id` (PK)
- `name` - Nome do produto
- `price` - Preço atual
- `old_price` - Preço antigo (opcional)
- `category` - Categoria
- `image` - URL da imagem
- `stock` - Quantidade em estoque
- `discount` - Percentual de desconto
- `created_at`, `updated_at`

**Tabela: usuarios**
- `id` (PK)
- `name` - Nome completo
- `email` - Email (único)
- `password` - Senha hash
- `is_admin` - Boolean
- `created_at`, `updated_at`

**Tabela: pedidos**
- `id` (PK)
- `customer_name` - Nome do cliente
- `customer_email` - Email do cliente
- `customer_phone` - Telefone
- `shipping_address` - Endereço de entrega
- `payment_method` - Método de pagamento
- `total` - Valor total
- `status` - Status do pedido
- `created_at`, `updated_at`

**Tabela: pedido_itens**
- `id` (PK)
- `order_id` (FK → pedidos)
- `product_id` (FK → produtos)
- `quantity` - Quantidade
- `price` - Preço unitário
- `created_at`

### 1.3 Dados de Exemplo

O script insere automaticamente:
- 6 produtos de sistemas
- 1 usuário admin (email: `admin@bmsistemas.com`, senha: `admin123`)

---

## ⚙️ Passo 2: Configurar Backend PHP

### 2.1 Configurar Conexão com Banco

Edite o arquivo `api/config/database.php`:

```php
private $host = "localhost";        // Host do MySQL
private $database_name = "bm_sistemas"; // Nome do banco
private $username = "root";         // Usuário MySQL
private $password = "";             // Senha MySQL
```

### 2.2 Estrutura da API

```
api/
├── config/
│   ├── database.php    # Conexão com banco
│   └── cors.php        # Configuração CORS
├── products/
│   ├── get.php         # GET - Listar produtos
│   ├── create.php      # POST - Criar produto
│   ├── update.php      # PUT - Atualizar produto
│   └── delete.php      # DELETE - Deletar produto
├── auth/
│   └── login.php       # POST - Autenticação
└── orders/
    └── create.php      # POST - Criar pedido
```

---

## 🚀 Passo 3: Rodar o Servidor

### Opção 1: PHP Built-in Server (Desenvolvimento)

Na raiz do projeto:

```bash
php -S localhost:8000
```

- Frontend: `http://localhost:8000/public/index.html`
- API: `http://localhost:8000/api/`

### Opção 2: Apache/Nginx (Produção)

Configure o DocumentRoot para a raiz do projeto e certifique-se que o módulo `mod_rewrite` está ativo.

---

## 🔗 Passo 4: Integrar Frontend com Backend

### 4.1 Configurar URL da API

Edite `public/js/products.js` e adicione no início:

```javascript
// URL base da API
const API_URL = 'http://localhost:8000/api';
```

### 4.2 Atualizar Função de Produtos

Substitua a função `renderProducts()`:

```javascript
// Carregar produtos da API
async function renderProducts() {
    try {
        const response = await fetch(`${API_URL}/products/get.php`);
        const products = await response.json();
        
        const promoContainer = document.getElementById('promoProducts');
        const catalogContainer = document.getElementById('catalogProducts');
        
        if (!promoContainer || !catalogContainer) return;
        
        // Produtos em promoção
        const promoProducts = products.filter(p => p.discount > 0);
        promoContainer.innerHTML = promoProducts.map(product => createProductCard(product)).join('');
        
        // Catálogo completo
        catalogContainer.innerHTML = products.map(product => createProductCard(product)).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showToast('Erro ao carregar produtos', 'error');
    }
}
```

### 4.3 Atualizar Login

Edite `public/login.html` e substitua o evento do form:

```javascript
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    
    btn.textContent = 'Entrando...';
    btn.disabled = true;
    
    try {
        const response = await fetch('http://localhost:8000/api/auth/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Login realizado com sucesso!', 'success');
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
            showToast(data.message || 'Erro ao fazer login', 'error');
            btn.textContent = 'Entrar';
            btn.disabled = false;
        }
    } catch (error) {
        showToast('Erro de conexão', 'error');
        btn.textContent = 'Entrar';
        btn.disabled = false;
    }
});
```

### 4.4 Atualizar Painel Admin

Edite `public/js/admin.js` para usar a API:

```javascript
const API_URL = 'http://localhost:8000/api';

// Carregar produtos
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products/get.php`);
        const products = await response.json();
        renderProductsTable(products);
    } catch (error) {
        showToast('Erro ao carregar produtos', 'error');
    }
}

// Salvar produto (criar ou atualizar)
async function saveProduct(productData) {
    const url = productData.id 
        ? `${API_URL}/products/update.php`
        : `${API_URL}/products/create.php`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast(data.message, 'success');
            loadProducts();
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Erro ao salvar produto', 'error');
    }
}

// Deletar produto
async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
        const response = await fetch(`${API_URL}/products/delete.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast(data.message, 'success');
            loadProducts();
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Erro ao deletar produto', 'error');
    }
}
```

### 4.5 Atualizar Checkout

Edite `public/js/checkout.js` para enviar pedido:

```javascript
async function finalizarCompra(formData) {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const total = parseFloat(document.getElementById('total').textContent.replace('R$ ', '').replace(',', '.'));
        
        const orderData = {
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            shipping_address: `${formData.address}, ${formData.number}, ${formData.city} - ${formData.state}`,
            payment_method: formData.payment,
            total: total,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };
        
        const response = await fetch('http://localhost:8000/api/orders/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Pedido realizado com sucesso!', 'success');
            localStorage.removeItem('cart');
            setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
            showToast(data.message || 'Erro ao finalizar pedido', 'error');
        }
    } catch (error) {
        showToast('Erro de conexão', 'error');
    }
}
```

---

## 📡 Endpoints da API

### Produtos

**GET** `/api/products/get.php`
- Lista todos os produtos
- Query param: `?id=1` para produto específico

**POST** `/api/products/create.php`
```json
{
  "name": "Sistema ERP",
  "price": 2499.99,
  "old_price": 3499.99,
  "category": "Gestão Empresarial",
  "image": "https://...",
  "stock": 10,
  "discount": 30
}
```

**POST** `/api/products/update.php`
```json
{
  "id": 1,
  "name": "Sistema ERP Atualizado",
  "price": 2299.99,
  ...
}
```

**POST** `/api/products/delete.php`
```json
{
  "id": 1
}
```

### Autenticação

**POST** `/api/auth/login.php`
```json
{
  "email": "admin@bmsistemas.com",
  "password": "admin123"
}
```

### Pedidos

**POST** `/api/orders/create.php`
```json
{
  "customer_name": "João Silva",
  "customer_email": "joao@email.com",
  "customer_phone": "(11) 98765-4321",
  "shipping_address": "Rua X, 123",
  "payment_method": "credit_card",
  "total": 2499.99,
  "items": [
    {
      "product_id": 1,
      "quantity": 1,
      "price": 2499.99
    }
  ]
}
```

---

## 🔒 Segurança

1. **Senhas**: Use `password_hash()` para criar senhas:
```php
$hashed = password_hash('senha123', PASSWORD_DEFAULT);
```

2. **SQL Injection**: Sempre use prepared statements (já implementado)

3. **CORS**: Ajuste em `api/config/cors.php` para produção:
```php
header("Access-Control-Allow-Origin: https://seudominio.com");
```

4. **HTTPS**: Use sempre HTTPS em produção

---

## 🐛 Troubleshooting

**Erro de conexão com banco:**
- Verifique credenciais em `api/config/database.php`
- Certifique-se que o MySQL está rodando

**CORS Error:**
- Verifique se `api/config/cors.php` está configurado
- No Chrome, desabilite CORS temporariamente para testes

**Erro 404 na API:**
- Verifique se o servidor está rodando
- Confirme a URL base da API nos arquivos JS

---

## 📱 Próximos Passos

- [ ] Implementar sistema de autenticação com JWT
- [ ] Adicionar upload de imagens para produtos
- [ ] Criar painel de relatórios
- [ ] Implementar gateway de pagamento
- [ ] Adicionar sistema de notificações por email

---

## 📞 Suporte

Para dúvidas, consulte a documentação do PHP e MySQL ou entre em contato com o desenvolvedor.
