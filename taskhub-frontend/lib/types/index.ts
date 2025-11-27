export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface User {
  id: number;
  cpf: string;
  email: string;
  name: string;
  role: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
  account?: Account;
}

export interface Account {
  id: number;
  login: string;
  userId: number;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  dueDate?: Date;
  categoryId: number;
  category?: Category;
  userId: number;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountDto {
  login: string;
  password: string;
  user: {
    cpf: string;
    email: string;
    name: string;
  };
}

export interface CreateUserDto {
  cpf: string;
  email: string;
  name: string;
  role?: string;
}

export interface UpdateUserDto {
  cpf?: string;
  email?: string;
  name?: string;
  role?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: Status;
  dueDate?: Date | string;
  categoryId: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Status;
  dueDate?: Date | string;
  categoryId?: number;
}

export interface LoginDto {
  login: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
  };
}

export interface JwtPayload {
  sub: number;
  username: string;
  email: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}

export interface AuthState {
  user: JwtPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: CreateAccountDto) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}