# Backend de Autenticação - BM Sistemas

## Visão Geral
Sistema de autenticação JWT implementado em PHP puro para proteger as APIs administrativas.

## Arquitetura

### Componentes Criados:

1. **api/config/jwt.php**
   - Classe JWT para codificar e decodificar tokens
   - Token com validade de 7 dias
   - Algoritmo HS256

2. **api/config/auth.php**
   - Middleware de autenticação
   - Verifica token JWT
   - Valida se usuário é admin
   - Métodos:
     - `authenticate()` - Verifica token e retorna dados do usuário
     - `requireAdmin()` - Verifica se é admin ou bloqueia acesso

3. **api/auth/login.php** (atualizado)
   - Login retorna token JWT
   - Token inclui: user_id, email, is_admin, iat, exp

4. **Frontend - public/js/auth.js**
   - Gerenciamento de autenticação no cliente
   - Armazena token em localStorage
   - Intercepta requisições e adiciona header Authorization
   - Classe AuthManager com métodos:
     - `login(email, password)`
     - `logout()`
     - `isAuthenticated()`
     - `isAdmin()`
     - `fetch(url, options)` - Requisições autenticadas

5. **Frontend - public/js/admin-auth.js**
   - Interceptor global de fetch
   - Adiciona automaticamente token em requisições administrativas
   - Redireciona para login em caso de token expirado/inválido

## Rotas Protegidas

Todas as rotas abaixo agora exigem autenticação de admin:

- **Produtos:**
  - POST /api/products/create.php
  - POST /api/products/update.php
  - DELETE /api/products/delete.php

- **Categorias:**
  - POST /api/categories/create.php
  - DELETE /api/categories/delete.php

- **Usuários:**
  - GET /api/users/get.php
  - POST /api/users/create.php
  - POST /api/users/update.php
  - DELETE /api/users/delete.php

- **Estatísticas:**
  - GET /api/stats/dashboard.php

- **Pedidos:**
  - GET /api/orders/get.php

## Rotas Públicas (Sem Autenticação)

- GET /api/products/get.php
- GET /api/categories/get.php
- POST /api/auth/login.php

## Fluxo de Autenticação

1. **Login:**
   ```javascript
   authManager.login('admin@admin.com', 'admin123')
   ```
   - Envia credenciais para /api/auth/login.php
   - Recebe token JWT
   - Armazena token e dados do usuário em localStorage

2. **Requisição Autenticada:**
   ```javascript
   fetch('/api/products/create.php', {
       method: 'POST',
       headers: {
           'Authorization': 'Bearer ' + token,
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(productData)
   })
   ```

3. **Verificação no Backend:**
   - Middleware extrai token do header Authorization
   - Decodifica e valida token
   - Verifica se usuário existe
   - Verifica se é admin (quando necessário)
   - Retorna 401 se falhar

4. **Logout:**
   - Remove token e dados do localStorage
   - Redireciona para /public/login.html

## Segurança

⚠️ **IMPORTANTE: ALTERE A CHAVE SECRETA**
No arquivo `api/config/jwt.php`, altere a linha:
```php
private static $secret_key = "BM_SISTEMAS_SECRET_KEY_2024";
```
Para uma chave mais segura e única.

## Credenciais Padrão

**Admin:**
- Email: admin@admin.com
- Senha: admin123

## Como Usar

1. Faça login na página `/public/login.html`
2. Se for admin, será redirecionado para `/public/admin.html`
3. Todas as operações administrativas agora estão protegidas
4. Token expira em 7 dias
5. Se token expirar, usuário é redirecionado para login

## Testando

1. Acesse http://localhost:8000/public/login.html
2. Faça login com as credenciais de admin
3. Acesse o painel administrativo
4. Tente fazer operações (criar produto, etc)
5. Todas devem funcionar com autenticação
6. Faça logout e tente acessar diretamente /public/admin.html
7. Deve redirecionar para login

## Estrutura de Token JWT

```json
{
  "user_id": 1,
  "email": "admin@admin.com",
  "is_admin": 1,
  "iat": 1234567890,
  "exp": 1234567890
}
```
