'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { taskService } from '@/services/task.service';
import { categoryService } from '@/services/category.service';
import { Task, Status, TaskFilters } from '@/models/task.model';
import { Category } from '@/models/category.model';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function TarefasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    categoryId: undefined,
    status: undefined,
    dueDateFrom: '',
    dueDateTo: '',
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Captura mensagem de sucesso dos query params
    const message = searchParams.get('success');
    if (message) {
      setSuccessMessage(message);
      // Remove a mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
        // Limpa os query params da URL
        router.replace('/principal/tarefa');
      }, 2000);
    }

    loadData();
  }, [router, searchParams]);

  useEffect(() => {
    applyFilters();
  }, [filters, tasks]);

  const loadData = async () => {
    try {
      const userId = userService.getCurrentUserId();
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const [tasksResponse, categoriesResponse] = await Promise.all([
        taskService.getTasksFromUser(userId),
        categoryService.getCategoriesFromUser(userId),
      ]);

      setTasks(tasksResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Filtro de pesquisa por título
    if (filters.search) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // Filtro por categoria
    if (filters.categoryId) {
      filtered = filtered.filter((task) => task.category?.id === filters.categoryId);
    }

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    // Filtro por data inicial
    if (filters.dueDateFrom) {
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) >= new Date(filters.dueDateFrom!);
      });
    }

    // Filtro por data final
    if (filters.dueDateTo) {
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) <= new Date(filters.dueDateTo!);
      });
    }

    setFilteredTasks(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value === '' ? undefined : name === 'categoryId' ? parseInt(value) : value,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categoryId: undefined,
      status: undefined,
      dueDateFrom: '',
      dueDateTo: '',
    });
  };

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await taskService.deleteTask(taskToDelete.id!);
      setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir tarefa');
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.PENDING:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case Status.IN_PROGRESS:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case Status.COMPLETED:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case Status.PENDING:
        return 'Pendente';
      case Status.IN_PROGRESS:
        return 'Em Progresso';
      case Status.COMPLETED:
        return 'Concluída';
      default:
        return status;
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Sem prazo';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TaskHub</h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/principal/tarefa/nova')}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                Nova Tarefa
              </button>
              <button
                onClick={() => router.push('/principal')}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Minhas Tarefas</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm flex items-center justify-between animate-fade-in">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage('')}
              className="ml-4 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Filtros</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Limpar Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Pesquisa */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pesquisar por título
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Digite o título..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
              />
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={filters.categoryId || ''}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status || ''}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
              >
                <option value="">Todos</option>
                <option value={Status.PENDING}>Pendente</option>
                <option value={Status.IN_PROGRESS}>Em Progresso</option>
                <option value={Status.COMPLETED}>Concluída</option>
              </select>
            </div>

            {/* Data De */}
            <div>
              <label htmlFor="dueDateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de
              </label>
              <input
                type="date"
                id="dueDateFrom"
                name="dueDateFrom"
                value={filters.dueDateFrom}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
              />
            </div>

            {/* Data Até */}
            <div>
              <label htmlFor="dueDateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data até
              </label>
              <input
                type="date"
                id="dueDateTo"
                name="dueDateTo"
                value={filters.dueDateTo}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition"
              />
            </div>
          </div>
        </div>

        {/* Lista de Tarefas */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma tarefa encontrada</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Tente ajustar os filtros ou crie uma nova tarefa
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {task.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span>{task.category?.name || 'Sem categoria'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => router.push(`/principal/tarefa/${task.id}/editar`)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(task)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                      title="Excluir"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteTask}
        itemName={taskToDelete?.title || ''}
        itemType="tarefa"
      />
    </div>
  );
}