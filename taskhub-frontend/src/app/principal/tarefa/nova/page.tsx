'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { taskService } from '@/services/task.service';
import { categoryService } from '@/services/category.service';
import { CreateTaskDto } from '@/models/task.model';
import { Category } from '@/models/category.model';
import TaskForm, { TaskFormData } from '../components/TaskForm';

export default function NovaTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadCategories();
  }, [router]);

  const loadCategories = async () => {
    try {
      const userId = userService.getCurrentUserId();
      if (userId) {
        const response = await categoryService.getCategoriesFromUser(userId);
        setCategories(response.data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError('Erro ao carregar categorias');
    }
  };

  const handleSubmit = async (data: TaskFormData) => {
    setError('');
    setLoading(true);

    try {
      const userId = userService.getCurrentUserId();
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      if (!data.categoryId) {
        throw new Error('Selecione uma categoria');
      }

      const taskData: CreateTaskDto = {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate || undefined,
        user: { id: userId },
        category: { id: parseInt(data.categoryId) },
      };

      await taskService.createTask(taskData);
      router.push('/principal/tarefa?success=Tarefa criada com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/principal/tarefa');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TaskHub</h1>
            <button
              onClick={() => router.push('/principal')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Nova Tarefa</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <TaskForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitButtonText="Criar Tarefa"
            isLoading={loading}
          />
        </div>
      </main>
    </div>
  );
}
