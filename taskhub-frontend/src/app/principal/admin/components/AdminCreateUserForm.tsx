'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, CreateUserFormData } from '@/schemas/user.schema';
import { Role } from '@/app/enums/role.enum';
import { formatCPF } from '@/utils/validators';

export type { CreateUserFormData };

interface AdminCreateUserFormProps {
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
}

export default function AdminCreateUserForm({
  onSubmit,
  isLoading,
  submitButtonText,
}: AdminCreateUserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      roles: [Role.User],
    },
  });

  const currentRoles = watch('roles');

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted, { shouldValidate: true });
  };

  const toggleRole = (role: Role, checked: boolean) => {
    if (checked) {
      setValue('roles', [...currentRoles, role], { shouldValidate: true });
    } else {
      setValue('roles', currentRoles.filter(r => r !== role), { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nome *
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Nome completo"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="email@exemplo.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          CPF *
        </label>
        <input
          type="text"
          id="cpf"
          {...register('cpf')}
          onChange={handleCPFChange}
          maxLength={14}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="000.000.000-00"
        />
        {errors.cpf && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cpf.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Roles *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={currentRoles.includes(Role.User)}
              onChange={e => toggleRole(Role.User, e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 disabled:opacity-50"
            />
            User
          </label>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={currentRoles.includes(Role.Admin)}
              onChange={e => toggleRole(Role.Admin, e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 disabled:opacity-50"
            />
            Admin
          </label>
        </div>
        {errors.roles && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.roles.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processando...' : submitButtonText}
      </button>
    </form>
  );
}
