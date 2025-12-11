import { z } from 'zod';
import { Role } from '@/app/enums/role.enum';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório')
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  
  email: z
    .string()
    .min(1, 'O email é obrigatório')
    .email('Email inválido'),
  
  cpf: z
    .string()
    .min(1, 'O CPF é obrigatório')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (formato: 000.000.000-00)')
    .refine((cpf) => {
      // Validação de CPF
      const numbers = cpf.replace(/\D/g, '');
      if (numbers.length !== 11) return false;
      if (/^(\d)\1+$/.test(numbers)) return false;
      
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers.charAt(i)) * (10 - i);
      }
      let digit = 11 - (sum % 11);
      if (digit >= 10) digit = 0;
      if (digit !== parseInt(numbers.charAt(9))) return false;
      
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(numbers.charAt(i)) * (11 - i);
      }
      digit = 11 - (sum % 11);
      if (digit >= 10) digit = 0;
      if (digit !== parseInt(numbers.charAt(10))) return false;
      
      return true;
    }, 'CPF inválido'),
  
  roles: z
    .array(z.nativeEnum(Role))
    .min(1, 'Selecione pelo menos uma role'),
});

export const createAccountSchema = z.object({
  userId: z
    .number({
      message: 'Selecione um usuário', 
    })
    .min(1, 'Selecione um usuário'),
  
  password: z
    .string()
    .min(1, 'A senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .max(50, 'A senha deve ter no máximo 50 caracteres'),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type CreateAccountFormData = z.infer<typeof createAccountSchema>;