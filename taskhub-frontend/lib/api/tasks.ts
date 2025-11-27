import api from './client';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types';

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async getByUserId(userId: number): Promise<Task[]> {
    const response = await api.get<Task[]>(`/tasks/user/${userId}`);
    return response.data;
  },
};
