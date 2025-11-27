'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../api/auth';
import { AuthContextType, JwtPayload, LoginDto, CreateAccountDto, Role } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura sessão ao carregar app
  useEffect(() => {
    console.log('🔄 AuthProvider: Carregando sessão do localStorage...');
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    console.log('📦 Token encontrado:', !!savedToken);
    console.log('📦 User encontrado:', !!savedUser);

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        console.log('✅ Sessão restaurada:', parsedUser);
      } catch (error) {
        console.error('❌ Erro ao parsear user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
    console.log('✅ AuthProvider: Carregamento concluído');
  }, []);

  const login = async (credentials: LoginDto) => {
    console.log('🔐 login: Iniciando processo...');
    
    try {
      console.log('🔐 login: Chamando authService.login');
      const response = await authService.login(credentials);
      console.log('🔐 login: Resposta recebida:', response);
      
      if (!response.access_token) {
        throw new Error('Token não recebido do servidor');
      }

      const decoded = jwtDecode<JwtPayload>(response.access_token);
      console.log('🔓 login: Token decodificado:', decoded);

      // Salva no localStorage
      console.log('💾 login: Salvando no localStorage...');
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(decoded));
      console.log('💾 login: Salvo com sucesso');

      // Atualiza o estado
      console.log('📝 login: Atualizando estado do React...');
      setToken(response.access_token);
      setUser(decoded);
      console.log('✅ login: Estado atualizado');

      // Redireciona
      console.log('🚀 login: Tentando redirecionar para /dashboard...');
      console.log('🚀 login: URL atual:', window.location.href);
      
      // Tenta múltiplas formas de redirecionamento
      try {
        window.location.href = '/dashboard';
        console.log('🚀 login: window.location.href executado');
      } catch (redirectError) {
        console.error('❌ login: Erro no redirecionamento:', redirectError);
        // Fallback
        router.push('/dashboard');
        console.log('🚀 login: router.push executado como fallback');
      }
    } catch (error) {
      console.error('❌ login: Erro geral:', error);
      throw error;
    }
  };

  const register = async (data: CreateAccountDto) => {
    const response = await authService.register(data);
    const decoded = jwtDecode<JwtPayload>(response.access_token);

    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(decoded));

    setToken(response.access_token);
    setUser(decoded);

    window.location.href = '/dashboard';
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);

    router.push('/auth/login');
  };

  const hasRole = (role: Role): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    hasRole,
  };

  console.log('📊 AuthContext state:', { isAuthenticated: !!token, isLoading, hasUser: !!user });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
