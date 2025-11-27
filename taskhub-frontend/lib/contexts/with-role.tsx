'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';
import { Role } from '../types';

export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: Role[]
) {
  return function RoleProtectedRoute(props: P) {
    const { user, isAuthenticated, isLoading, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push('/auth/login');
          return;
        }

        const hasRequiredRole = allowedRoles.some((role) => hasRole(role));
        if (!hasRequiredRole) {
          router.push('/dashboard');
        }
      }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated || !allowedRoles.some((role) => hasRole(role))) {
      return null;
    }

    return <Component {...props} />;
  };
}
