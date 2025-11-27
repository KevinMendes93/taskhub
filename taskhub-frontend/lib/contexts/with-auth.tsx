'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [checkedLocalStorage, setCheckedLocalStorage] = useState(false);

    // Verifica localStorage imediatamente (antes do React carregar o contexto)
    useEffect(() => {
      console.log('🔒 withAuth: Verificando localStorage...');
      const token = localStorage.getItem('token');
      console.log('🔑 Token no localStorage:', !!token);
      
      if (!token) {
        console.log('❌ Sem token, redirecionando para login...');
        router.replace('/auth/login');
      } else {
        console.log('✅ Token encontrado no localStorage');
        setCheckedLocalStorage(true);
      }
    }, [router]);

    useEffect(() => {
      console.log('🔒 withAuth: Estado do contexto:', { isAuthenticated, isLoading, checkedLocalStorage });
      
      if (!isLoading && !isAuthenticated && checkedLocalStorage) {
        console.log('❌ Não autenticado após carregar contexto, redirecionando...');
        router.replace('/auth/login');
      }
    }, [isAuthenticated, isLoading, router, checkedLocalStorage]);

    // Mostra loading enquanto verifica autenticação
    if (isLoading || !checkedLocalStorage) {
      console.log('⏳ withAuth: Mostrando loading...');
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      console.log('❌ withAuth: Não autenticado, retornando null');
      return null;
    }

    console.log('✅ withAuth: Autenticado, renderizando componente');
    return <Component {...props} />;
  };
}
