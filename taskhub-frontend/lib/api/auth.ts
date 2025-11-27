import api from './client';
import { LoginDto, LoginResponse, CreateAccountDto } from '../types';

export const authService = {
  async login(credentials: LoginDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: CreateAccountDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data);
    return response.data;
  },
};
