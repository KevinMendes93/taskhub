'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/theme.context';
import ThemeToggle from './ThemeToggle';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeToggle />
      {children}
    </ThemeProvider>
  );
}
