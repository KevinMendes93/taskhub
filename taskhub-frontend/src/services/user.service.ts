import { api } from '@/config/axios.config';
import { User } from '@/models/user.model';
import { ApiResponse } from '@/models/api.model';
import { authService } from './auth.service';
import { Role } from '@/app/enums/role.enum';

export const userService = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await api.get<ApiResponse<User[]>>('/user');
    return response.data;
  },

  async getUserById(id: number): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>(`/user/${id}`);
    return response.data;
  },

  async createUser(data: User): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>(`/user`, data);
    return response.data;
  },

  async updateUser(id: number | undefined, data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.patch<ApiResponse<User>>(`/user/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/user/${id}`);
    return response.data;
  },

  getCurrentUser(): string | null {
    return authService.getUserLogin();
  },

  getCurrentUserId(): number | null {
    return authService.getUserId();
  },

  getRolesFromUser(): Role[] | null {
    return authService.getUserRoles();
  }
};