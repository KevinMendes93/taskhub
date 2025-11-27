import api from './client';
import { LoginDto, LoginResponse, CreateAccountDto } from '../types';

export const authService = {
  async login(credentials: LoginDto): Promise<{ access_token: string }> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    // Retorna apenas o data.access_token
    return { access_token: response.data.data.access_token };
  },

  async register(data: CreateAccountDto): Promise<{ access_token: string }> {
    const response = await api.post<LoginResponse>('/auth/register', data);
    // Retorna apenas o data.access_token
    return { access_token: response.data.data.access_token };
  },
};
