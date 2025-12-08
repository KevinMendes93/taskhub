import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Só redireciona para login se:
    // 1. O erro for 401 (não autorizado)
    // 2. NÃO for uma requisição de login (para evitar loop)
    // 3. NÃO estiver na página de login ou cadastro
    if (error.response?.status === 401) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

      // Só redireciona se não for requisição de auth e não estiver em página de auth
      if (!isAuthRequisition(currentPath, error)) {
        Cookies.remove('access_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

function isAuthRequisition(currentPath: string, error: any): boolean {
  const isLoginRequest = error.config?.url?.includes('/auth/login');
  const isRegisterRequest = error.config?.url?.includes('/auth/register');
  const isAuthPage = currentPath === '/login' || currentPath === '/cadastro';
  return isLoginRequest || isRegisterRequest || isAuthPage;
}