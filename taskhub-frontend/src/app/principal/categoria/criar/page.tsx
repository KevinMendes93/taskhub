'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/services/category.service';
import { userService } from '@/services/user.service';
import CategoryForm, { CategoryFormData } from '../components/CategoryForm';

export default function CriarCategoriaPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CategoryFormData) => {
    setError('');
    setLoading(true);

    try {
      const userId = userService.getCurrentUserId();
      
      if (!userId) {
        setError('Usuário não encontrado');
        return;
      }
      
      const response = await categoryService.createCategory({
        name: data.name,
        description: data.description || undefined,
        user: { id: userId },
      });

      if (response.success) {
        router.push('/principal/categoria?success=Categoria criada com sucesso!');
      } else {
        setError(response.message || 'Erro ao criar categoria');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        setError(message.join(', '));
      } else {
        setError(message || 'Erro ao conectar com o servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/principal/categoria');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Nova Categoria
            </h1>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <CategoryForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitButtonText="Criar Categoria"
            isLoading={loading}
          />
        </div>
      </main>
    </div>
  );
}
