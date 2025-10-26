'use client';

import type { ReactNode } from 'react';
import { useTasks } from '@/hooks';
import { CreateTaskProvider } from './CreateTaskProvider';

interface CreateTaskProviderWrapperProps {
  children: ReactNode;
}

/**
 * CreateTaskProvider 的包装器，用于获取任务列表
 */
export function CreateTaskProviderWrapper({ children }: CreateTaskProviderWrapperProps) {
  const { tasks } = useTasks();

  return <CreateTaskProvider tasks={tasks}>{children}</CreateTaskProvider>;
}
