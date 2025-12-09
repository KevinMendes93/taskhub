// Validators para formulários

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Formatadores
export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const unformatCPF = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Validadores
export const validateCPF = (cpf: string): ValidationResult => {
  const numbers = cpf.replace(/\D/g, '');
  
  if (numbers.length !== 11) {
    return { isValid: false, error: 'CPF deve ter 11 dígitos' };
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) {
    return { isValid: false, error: 'CPF inválido' };
  }

  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) {
    return { isValid: false, error: 'CPF inválido' };
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) {
    return { isValid: false, error: 'CPF inválido' };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'E-mail é obrigatório' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'E-mail inválido' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Senha é obrigatória' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'A senha deve ter pelo menos 8 caracteres' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'A senha deve ter pelo menos uma letra maiúscula' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'A senha deve ter pelo menos uma letra minúscula' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'A senha deve ter pelo menos um número' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'A senha deve ter pelo menos um caractere especial' };
  }
  
  return { isValid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'As senhas não coincidem' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }
  
  if (name.trim().length < 3) {
    return { isValid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
  }
  
  return { isValid: true };
};

export const validateLogin = (login: string): ValidationResult => {
  // Login agora é um CPF
  return validateCPF(login);
};

// Validação completa do formulário de cadastro
export interface CadastroFormData {
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  cpf: string;
}

export const validateCadastroForm = (formData: CadastroFormData): ValidationResult => {
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) return nameValidation;

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) return emailValidation;

  const cpfValidation = validateCPF(formData.cpf);
  if (!cpfValidation.isValid) return cpfValidation;

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) return passwordValidation;

  const passwordMatchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
  if (!passwordMatchValidation.isValid) return passwordMatchValidation;

  return { isValid: true };
};
