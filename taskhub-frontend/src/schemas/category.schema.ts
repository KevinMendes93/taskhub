import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'O nome da categoria é obrigatório')
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres'),
  
  description: z
    .string()
    .min(1, 'A descrição é obrigatória')
    .min(5, 'A descrição deve ter no mínimo 5 caracteres')
    .max(200, 'A descrição deve ter no máximo 200 caracteres'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
