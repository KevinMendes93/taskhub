'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAccountSchema, CreateAccountFormData } from '@/schemas/user.schema';
import { User } from '@/models/user.model';
import { formatCPF } from '@/utils/validators';

export type { CreateAccountFormData };

interface AdminCreateAccountFormProps {
  users: User[];
  onSubmit: (data: CreateAccountFormData) => Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
}

export default function AdminCreateAccountForm({
  users,
  onSubmit,
  isLoading,
  submitButtonText,
}: AdminCreateAccountFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      userId: 0,
      password: '',
    },
  });

  const selectedUserId = watch('userId');
  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Selecionar Usuário *
        </label>
        <select
          id="userId"
          {...register('userId', { valueAsNumber: true })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value={0}>Selecione um usuário...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} - {user.email}
            </option>
          ))}
        </select>
        {errors.userId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.userId.message}</p>
        )}
      </div>

      {selectedUser && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Login (CPF)
          </label>
          <input
            type="text"
            value={formatCPF(selectedUser.cpf!)}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            placeholder="000.000.000-00"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            O login será o CPF do usuário selecionado
          </p>
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Senha *
        </label>
        <input
          type="password"
          id="password"
          {...register('password')}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Senha forte"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processando...' : submitButtonText}
      </button>
    </form>
  );
}
