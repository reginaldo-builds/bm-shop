// Atualizar todas as requisições do admin.js para usar autenticação

// Sobrescrever funções para adicionar autenticação
const originalFetch = window.fetch;

// Interceptar todas as requisições da API
window.fetch = function(url, options = {}) {
    // Se for uma requisição para a API e não for GET de categorias/produtos
    if (url.includes('/api/') && !url.includes('/api/auth/login')) {
        // Métodos que precisam de autenticação
        const needsAuth = ['POST', 'PUT', 'DELETE'].includes(options.method) || 
                         url.includes('/users/') ||
                         url.includes('/stats/dashboard') ||
                         url.includes('/orders/');
        
        if (needsAuth) {
            const token = authManager.getToken();
            if (!token) {
                window.location.href = '/public/login.html';
                return Promise.reject(new Error('Não autenticado'));
            }
            
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }
    }
    
    return originalFetch(url, options)
        .then(response => {
            // Se retornar 401, redirecionar para login
            if (response.status === 401 && !url.includes('/api/auth/login')) {
                authManager.logout();
            }
            return response;
        });
};
