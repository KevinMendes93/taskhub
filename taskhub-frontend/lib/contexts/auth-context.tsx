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
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginDto) => {
    const response = await authService.login(credentials);
    const decoded = jwtDecode<JwtPayload>(response.access_token);

    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(decoded));

    setToken(response.access_token);
    setUser(decoded);

    router.push('/dashboard');
  };

  const register = async (data: CreateAccountDto) => {
    const response = await authService.register(data);
    const decoded = jwtDecode<JwtPayload>(response.access_token);

    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(decoded));

    setToken(response.access_token);
    setUser(decoded);

    router.push('/dashboard');
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
