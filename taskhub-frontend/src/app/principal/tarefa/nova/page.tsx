'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { taskService } from '@/services/task.service';
import { categoryService } from '@/services/category.service';
import { Status, CreateTaskDto } from '@/models/task.model';
import { Category } from '@/models/category.model';

export default function NovaTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [tarefaForm, setTarefaForm] = useState({
    title: '',
    description: '',
    status: Status.PENDING,
    dueDate: '',
    categoryId: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const userId = userService.getCurrentUserId();
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      if (!tarefaForm.categoryId) {
        throw new Error('Selecione uma categoria');
      }

      const taskData: CreateTaskDto = {
        title: tarefaForm.title,
        description: tarefaForm.description,
        status: tarefaForm.status,
        dueDate: tarefaForm.dueDate || undefined,
        user: { id: userId },
        category: { id: parseInt(tarefaForm.categoryId) },
      };

      await taskService.createTask(taskData);
      setSuccess('Tarefa criada com sucesso!');
      
      setTimeout(() => {
        router.push('/principal/tarefa');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTarefaForm({
      ...tarefaForm,
      [e.target.name]: e.target.value,
    });
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

          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={tarefaForm.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
                placeholder="Digite o título da tarefa"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição *
              </label>
              <textarea
                id="description"
                name="description"
                value={tarefaForm.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
                placeholder="Digite a descrição da tarefa"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={tarefaForm.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={tarefaForm.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
              >
                <option value={Status.PENDING}>Pendente</option>
                <option value={Status.IN_PROGRESS}>Em Progresso</option>
                <option value={Status.COMPLETED}>Concluída</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Vencimento
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={tarefaForm.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar Tarefa'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/principal')}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
