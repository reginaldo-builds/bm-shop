// Gerenciamento de autenticação no frontend
const API_URL = '/api';

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // Fazer login
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return { success: false, message: 'Erro ao conectar com o servidor.' };
        }
    }

    // Fazer logout
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/public/login.html';
    }

    // Verificar se está logado
    isAuthenticated() {
        return !!this.token;
    }

    // Verificar se é admin
    isAdmin() {
        return this.user && this.user.is_admin === 1;
    }

    // Obter token
    getToken() {
        return this.token;
    }

    // Obter usuário
    getUser() {
        return this.user;
    }

    // Fazer requisição autenticada
    async fetch(url, options = {}) {
        if (!this.token) {
            throw new Error('Usuário não autenticado');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Se retornar 401, token expirou
            if (response.status === 401) {
                this.logout();
                throw new Error('Sessão expirada');
            }

            return response;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }
}

// Instância global do AuthManager
const authManager = new AuthManager();
