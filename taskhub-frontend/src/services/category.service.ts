import { api } from '@/config/axios.config';
import { ApiResponse } from '@/models/api.model';
import { Category } from '@/models/category.model';

export const categoryService = {
  async getCategoriesFromUser(userId: number): Promise<ApiResponse<Category[]>> {
    const response = await api.get<ApiResponse<Category[]>>(`/category/user/${userId}`);
    return response.data;
  },

  async getCategory(id: number): Promise<ApiResponse<Category>> {
    const response = await api.get<ApiResponse<Category>>(`/category/${id}`);
    return response.data;
  },

  async createCategory(data: Category): Promise<ApiResponse<Category>> {
    const response = await api.post<ApiResponse<Category>>('/category', data);
    return response.data;
  },

  async updateCategory(id: number, data: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await api.patch<ApiResponse<Category>>(`/category/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/category/${id}`);
    return response.data;
  },
};
