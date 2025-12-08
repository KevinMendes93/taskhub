'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona baseado no status de autenticação
    if (authService.isAuthenticated()) {
      router.push('/principal');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">TaskHub</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Carregando...</p>
      </div>
    </div>
  );
}
