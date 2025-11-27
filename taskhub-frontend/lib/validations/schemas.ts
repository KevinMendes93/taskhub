import { z } from 'zod';

// Validador de CPF
function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}

// Schema de CPF
export const cpfSchema = z
  .string()
  .min(11, 'CPF deve ter 11 dígitos')
  .max(14, 'CPF inválido')
  .refine((cpf) => validateCPF(cpf), {
    message: 'CPF inválido',
  });

// Schema de senha forte
export const strongPasswordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[@$!%*?&#]/, 'A senha deve conter pelo menos um caractere especial');

// Schema de login
export const loginSchema = z.object({
  login: z.string().min(3, 'Login deve ter no mínimo 3 caracteres'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Schema de registro
export const registerSchema = z.object({
  login: z.string().min(3, 'Login deve ter no mínimo 3 caracteres'),
  password: strongPasswordSchema,
  user: z.object({
    cpf: cpfSchema,
    email: z.string().email('E-mail inválido'),
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  }),
});

// Schema de criação de tarefa
export const createTaskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
  dueDate: z.string().optional(),
  categoryId: z.number().min(1, 'Selecione uma categoria'),
});

// Schema de atualização de tarefa
export const updateTaskSchema = createTaskSchema.partial();

// Schema de criação de categoria
export const createCategorySchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
});

// Schema de atualização de categoria
export const updateCategorySchema = createCategorySchema.partial();

// Tipos inferidos dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
