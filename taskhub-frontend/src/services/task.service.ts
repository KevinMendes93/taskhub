import { api } from '@/config/axios.config';
import { ApiResponse } from '@/models/api.model';
import { Task, CreateTaskDto, TaskFilters } from '@/models/task.model';

export const taskService = {
  async getTasksFromUser(userId: number, filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    let url = `/task/user/${userId}`;
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom);
      if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }
    
    const response = await api.get<ApiResponse<Task[]>>(url);
    return response.data;
  },

  async getAllTasks(): Promise<ApiResponse<Task[]>> {
    const response = await api.get<ApiResponse<Task[]>>('/task');
    return response.data;
  },

  async getTask(id: number): Promise<ApiResponse<Task>> {
    const response = await api.get<ApiResponse<Task>>(`/task/${id}`);
    return response.data;
  },

  async createTask(data: CreateTaskDto): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>('/task', data);
    return response.data;
  },

  async updateTask(id: number, data: Partial<CreateTaskDto>): Promise<ApiResponse<Task>> {
    const response = await api.patch<ApiResponse<Task>>(`/task/${id}`, data);
    return response.data;
  },

  async deleteTask(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/task/${id}`);
    return response.data;
  },
};
