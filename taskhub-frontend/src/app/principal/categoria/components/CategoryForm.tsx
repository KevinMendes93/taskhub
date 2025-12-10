'use client';

import { User } from '@/models/user.model';
import { useState } from 'react';

export interface CategoryFormData {
  name: string;
  description: string;
  user: User
}

interface CategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export default function CategoryForm({
  initialData = { name: '', description: '', user: {id: undefined} },
  onSubmit,
  onCancel,
  submitButtonText = 'Salvar',
  isLoading = false,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nome da Categoria *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Ex: Trabalho, Pessoal, Estudos..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Máximo de 100 caracteres
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descrição (Opcional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          maxLength={255}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Descreva o propósito desta categoria..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Máximo de 255 caracteres
        </p>
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
