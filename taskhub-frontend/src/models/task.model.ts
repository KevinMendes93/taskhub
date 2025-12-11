import { User } from './user.model';
import { Category } from './category.model';

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: Status;
  dueDate?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  category?: Category;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: Status;
  dueDate?: Date | string;
  user: { id: number };
  category: { id: number };
}

export interface TaskFilters {
  search?: string;
  categoryId?: number;
  status?: Status;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface CountTaskDto {
  pending?: number;
  completed?: number;
}