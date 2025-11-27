'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { loginSchema, LoginFormData } from '@/lib/validations/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // Previne múltiplas requisições simultâneas
    if (isSubmittingRef.current) {
      return;
    }

    setError(null);
    setIsLoading(true);
    isSubmittingRef.current = true;

    console.log('🎯 onSubmit: Iniciando processo de login');

    try {
      console.log('🎯 onSubmit: Chamando função login do contexto');
      await login(data);
      console.log('🎯 onSubmit: Login concluído com sucesso');
      // O redirecionamento é feito no auth-context após sucesso
    } catch (err: any) {
      console.log('🎯 onSubmit: Erro capturado:', err);
      // Traduzir mensagens de erro do backend
      let errorMessage = 'Erro interno no Servidor, tente novamente em alguns instantes.';
      
      if (err.response?.data?.message) {
        const backendMessage = err.response.data.message;
        
        // Traduzir mensagens comuns do backend
        if (backendMessage === "User or Password don't match") {
          errorMessage = 'Usuário ou senha incorretos.';
        } else if (backendMessage.includes('not found')) {
          errorMessage = 'Usuário não encontrado.';
        } else {
          errorMessage = backendMessage;
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Usuário ou senha incorretos.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
      } else if (!err.response) {
        errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <LogIn className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Bem-vindo ao TaskHub</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Login"
              placeholder="Digite seu login"
              error={errors.login?.message}
              disabled={isLoading}
              {...register('login')}
            />

            <Input
              type="password"
              label="Senha"
              placeholder="Digite sua senha"
              error={errors.password?.message}
              disabled={isLoading}
              {...register('password')}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
