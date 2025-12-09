import { api } from '@/config/axios.config';
import { ApiResponse } from '@/models/api.model';
import { Account } from '@/models/user.model';

export const accountService = {
  async createAccount(data: Account): Promise<ApiResponse<Account>> {
    const response = await api.post<ApiResponse<Account>>('/auth/register', data);
    return response.data;
  }
};
