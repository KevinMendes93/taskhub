import Cookies from 'js-cookie';
import { api } from '@/config/axios.config';
import { LoginData, RegisterData, LoginResponse, JwtPayload } from '@/models/auth.model';
import { ApiResponse } from '@/models/api.model';
import { decodeJwt } from '@/utils/jwt.utils';
import { Role } from '@/app/enums/role.enum';

const getToken = () => {
  return Cookies.get('access_token');
};

const getTokenPayload = (): JwtPayload | null => {
  const token = getToken();
  if (!token) return null;
  return decodeJwt(token);
};

export const authService = {
  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<ApiResponse<unknown>> {
    const response = await api.post<ApiResponse<unknown>>('/auth/register', data);
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout no backend:', error);
    } finally {
      Cookies.remove('access_token');
    }
  },

  setToken(token: string) {
    Cookies.set('access_token', token, { expires: 1 });
  },

  isAuthenticated() {
    return !!getToken();
  },

  getUserLogin(): string | null {
    const payload = getTokenPayload();
    return payload?.username ?? null;
  },

  getUserId(): number | null {
    const payload = getTokenPayload();
    return payload?.sub ?? null;
  },

  getUserRoles(): Role[] | null {
    const payload = getTokenPayload();
    return payload?.roles ?? null;
  }
};
