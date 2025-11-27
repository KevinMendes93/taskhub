import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Adiciona token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Remove logging do Axios em produção para evitar exposição de dados sensíveis
    if (process.env.NODE_ENV === 'production') {
      config.transformRequest = [
        (data) => {
          // Não faz log dos dados em produção
          return JSON.stringify(data);
        },
      ];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Logout automático em 401 (EXCETO na rota de login/register)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não redirecionar se for erro de autenticação (login/register)
    const isAuthRequest = error.config?.url?.includes('/auth/login') || 
                          error.config?.url?.includes('/auth/register');
    
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    // Retorna o erro sem fazer console.error para evitar stack trace duplicado
    return Promise.reject(error);
  }
);

export default api;
