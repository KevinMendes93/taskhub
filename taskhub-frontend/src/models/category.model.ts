import { User } from './user.model';

export interface Category {
  id: number;
  name: string;
  description?: string;
  user?: User;
}