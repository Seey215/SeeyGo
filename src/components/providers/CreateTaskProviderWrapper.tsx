'use client';

import type { ReactNode } from 'react';
import { CreateTaskProvider } from './CreateTaskProvider';

interface CreateTaskProviderWrapperProps {
  children: ReactNode;
}

/**
 * CreateTaskProvider 的包装器
 */
export function CreateTaskProviderWrapper({ children }: CreateTaskProviderWrapperProps) {
  return <CreateTaskProvider>{children}</CreateTaskProvider>;
}
