'use client';

import { createContext, type ReactNode, useContext } from 'react';
import { TaskEditSidebar } from '@/components/tasks';
import { useCreateTask } from '@/hooks';

interface CreateTaskContextType {
  openCreateModal: (defaultCategoryId?: string, viewType?: string) => void;
}

const CreateTaskContext = createContext<CreateTaskContextType | undefined>(undefined);

interface CreateTaskProviderProps {
  children: ReactNode;
}

/**
 * 全局创建任务提供者
 * 提供统一的创建任务侧边栏管理
 */
export function CreateTaskProvider({ children }: CreateTaskProviderProps) {
  const { isOpen, defaultCategoryId, defaultViewType, openCreateModal, closeCreateModal } =
    useCreateTask();

  const contextValue = {
    openCreateModal,
  };

  return (
    <CreateTaskContext.Provider value={contextValue}>
      {children}
      {/* 全局创建任务侧边栏 */}
      <TaskEditSidebar
        isOpen={isOpen}
        onClose={closeCreateModal}
        defaultCategoryId={defaultCategoryId}
        defaultViewType={defaultViewType}
      />
    </CreateTaskContext.Provider>
  );
}

/**
 * 使用创建任务上下文的 Hook
 */
export function useCreateTaskContext() {
  const context = useContext(CreateTaskContext);
  if (!context) {
    throw new Error('useCreateTaskContext must be used within a CreateTaskProvider');
  }
  return context;
}
