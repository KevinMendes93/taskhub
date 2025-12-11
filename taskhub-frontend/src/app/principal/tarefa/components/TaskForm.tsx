'use client';

import { Status } from '@/models/task.model';
import { Category } from '@/models/category.model';
import { User } from '@/models/user.model';
import { useState } from 'react';

export interface TaskFormData {
  title: string;
  description: string;
  status: Status;
  dueDate: string;
  categoryId: string;
  user: User;
}

interface TaskFormProps {
  initialData?: TaskFormData;
  categories: Category[];
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export default function TaskForm({
  initialData = { 
    title: '', 
    description: '', 
    status: Status.PENDING, 
    dueDate: '', 
    categoryId: '', 
    user: { id: undefined } 
  },
  categories,
  onSubmit,
  onCancel,
  submitButtonText = 'Salvar',
  isLoading = false,
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Título *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Digite o título da tarefa"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Máximo de 100 caracteres
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descrição *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          maxLength={255}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Digite a descrição da tarefa"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Máximo de 255 caracteres
        </p>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Categoria *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          value={formData.status}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value={Status.PENDING}>Pendente</option>
          <option value={Status.IN_PROGRESS}>Em Progresso</option>
          <option value={Status.COMPLETED}>Concluída</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Data de Vencimento (Opcional)
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
