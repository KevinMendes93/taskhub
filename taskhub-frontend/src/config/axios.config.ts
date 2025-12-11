import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Necessário para enviar/receber cookies httpOnly
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

// Interceptor para tratar erros de autenticação e fazer refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for erro 401 e a requisição ainda não foi re-tentada
    if (error.response?.status === 401 && !originalRequest._retry) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

      // Não tentar refresh em rotas de autenticação ou páginas de login/cadastro
      if (isAuthRequisition(currentPath, error)) {
        return Promise.reject(error);
      }

      // Marcar que já tentamos fazer refresh para evitar loop
      originalRequest._retry = true;

      try {
        // Tentar fazer refresh do token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data?.success && response.data?.data?.access_token) {
          const newAccessToken = response.data.data.access_token;
          
          // Atualizar o token no cookie
          Cookies.set('access_token', newAccessToken, { expires: 1 });
          
          // Atualizar o header da requisição original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Re-tentar a requisição original
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se o refresh falhar, limpar token e redirecionar para login
        Cookies.remove('access_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Se não for 401 ou já tentamos refresh, apenas rejeitar
    if (error.response?.status === 401) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      
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
  const isRefreshRequest = error.config?.url?.includes('/auth/refresh');
  const isAuthPage = currentPath === '/login' || currentPath === '/cadastro';
  return isLoginRequest || isRegisterRequest || isRefreshRequest || isAuthPage;
}