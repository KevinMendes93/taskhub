import Cookies from 'js-cookie';
import { api } from '@/config/axios.config';
import { LoginData, RegisterData, LoginResponse } from '@/models/auth.model';
import { ApiResponse } from '@/models/api.model';

export const authService = {
  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<ApiResponse<unknown>> {
    const response = await api.post<ApiResponse<unknown>>('/auth/register', data);
    return response.data;
  },

  logout() {
    Cookies.remove('access_token');
  },

  setToken(token: string) {
    Cookies.set('access_token', token, { expires: 1 }); // expira em 1 dia
  },

  getToken() {
    return Cookies.get('access_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
