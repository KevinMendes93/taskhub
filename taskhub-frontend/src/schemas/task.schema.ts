import { z } from 'zod';
import { Status } from '@/models/task.model';

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  
  description: z
    .string()
    .min(1, 'A descrição é obrigatória')
    .min(10, 'A descrição deve ter no mínimo 10 caracteres')
    .max(500, 'A descrição deve ter no máximo 500 caracteres'),
  
  categoryId: z
    .string()
    .min(1, 'Selecione uma categoria'),
  
  status: z.enum(Status, {
    message: 'Status inválido',
  }),
  
  dueDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date).getDate();
        const now = new Date().getDate();
        return selectedDate >= now;
      },
      { message: 'A data deve ser futura' }
    ),
});

export type TaskFormData = z.infer<typeof taskSchema>;
