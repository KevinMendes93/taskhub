'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { categoryService } from '@/services/category.service';
import CategoryForm, { CategoryFormData } from '../../components/CategoryForm';

export default function EditarCategoriaPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params.id);

  const [initialData, setInitialData] = useState<CategoryFormData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadCategory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategory(categoryId);
      if (response.success && response.data) {
        setInitialData({
          name: response.data.name,
          description: response.data.description || '',
        });
      } else {
        setError('Categoria não encontrada');
      }
    } catch {
      setError('Erro ao carregar categoria');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  const handleSubmit = async (data: CategoryFormData) => {
    setError('');
    setSubmitting(true);

    try {
      const response = await categoryService.updateCategory(categoryId, {
        name: data.name,
        description: data.description || undefined,
      });

      if (response.success) {
        router.push('/principal/categoria?success=Categoria atualizada com sucesso!');
      } else {
        setError(response.message || 'Erro ao atualizar categoria');
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
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/principal/categoria');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Editar Categoria
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
          {initialData && (
            <CategoryForm
              defaultValues={initialData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitButtonText="Salvar Alterações"
              isLoading={submitting}
            />
          )}
        </div>
      </main>
    </div>
  );
}
