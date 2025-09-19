'use client';

import React, { ReactNode } from 'react';
import { TaskProvider } from './TaskContext';
import { CategoryProvider } from './CategoryContext';
import { AppStateProvider } from './AppStateContext';

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
        <TaskProvider>
          {children}
        </TaskProvider>
      </CategoryProvider>
    </AppStateProvider>
  );
}

// 导出所有 Context
export { TaskContext, TaskProvider } from './TaskContext';
export { CategoryContext, CategoryProvider } from './CategoryContext';
export { AppStateContext, AppStateProvider } from './AppStateContext';