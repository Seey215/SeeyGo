'use client';

import type { ReactNode } from 'react';
import { AppStateProvider } from './AppStateContext';
import { CategoryProvider } from './CategoryContext';
import { TaskProvider } from './TaskContext';

/**
 * 组合所有 Context Providers
 */
interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppStateProvider>
      <CategoryProvider>
        <TaskProvider>{children}</TaskProvider>
      </CategoryProvider>
    </AppStateProvider>
  );
}

export { AppStateContext, AppStateProvider } from './AppStateContext';
export { CategoryContext, CategoryProvider } from './CategoryContext';
// 导出所有 Context
export { TaskContext, TaskProvider } from './TaskContext';
