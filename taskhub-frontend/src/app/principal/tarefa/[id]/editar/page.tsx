'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { taskService } from '@/services/task.service';
import { categoryService } from '@/services/category.service';
import { CreateTaskDto } from '@/models/task.model';
import { Category } from '@/models/category.model';
import TaskForm, { TaskFormData } from '../../components/TaskForm';

export default function EditarTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState<TaskFormData | undefined>();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadData();
  }, [router, taskId]);

  const loadData = async () => {
    try {
      const userId = userService.getCurrentUserId();
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const [taskResponse, categoriesResponse] = await Promise.all([
        taskService.getTask(parseInt(taskId)),
        categoryService.getCategoriesFromUser(userId),
      ]);

      const task = taskResponse.data;
      if (!task) {
        throw new Error('Tarefa não encontrada');
      }

      setCategories(categoriesResponse.data || []);

      // Formatar a data para date input (YYYY-MM-DD)
      let formattedDate = '';
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        formattedDate = date.toISOString().split('T')[0];
      }

      setInitialData({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: formattedDate,
        categoryId: task.category?.id?.toString() || '',
        user: { id: userId },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao carregar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: TaskFormData) => {
    setError('');
    setSaving(true);

    try {
      const userId = userService.getCurrentUserId();
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      if (!data.categoryId) {
        throw new Error('Selecione uma categoria');
      }

      const taskData: Partial<CreateTaskDto> = {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate || undefined,
        user: { id: userId },
        category: { id: parseInt(data.categoryId) },
      };

      await taskService.updateTask(parseInt(taskId), taskData);
      router.push('/principal/tarefa?success=Tarefa atualizada com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao atualizar tarefa');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/principal/tarefa');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400">Erro ao carregar dados da tarefa</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TaskHub</h1>
            <button
              onClick={() => router.push('/principal/tarefa')}
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Editar Tarefa</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <TaskForm
            initialData={initialData}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitButtonText="Salvar Alterações"
            isLoading={saving}
          />
        </div>
      </main>
    </div>
  );
}
