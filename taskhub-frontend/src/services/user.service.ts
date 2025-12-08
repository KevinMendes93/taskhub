import { api } from '@/config/axios.config';
import { User } from '@/models/user.model';
import { ApiResponse } from '@/models/api.model';

export const userService = {
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/user/currentUser');
    console.log('getCurrentUser response:', response.data);
    return response.data;
  },

  async getUserById(id: number): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>(`/user/${id}`);
    return response.data;
  },

  async updateUser(id: number, data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.patch<ApiResponse<User>>(`/user/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/user/${id}`);
    return response.data;
  },
};
