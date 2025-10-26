'use client';

import { createContext, type ReactNode, useContext } from 'react';
import { TaskEditSidebar } from '@/components/tasks';
import { useCreateTask } from '@/hooks';
import type { Task } from '@/types';

interface CreateTaskContextType {
  openCreateModal: (defaultCategoryId?: string, viewType?: string) => void;
}

const CreateTaskContext = createContext<CreateTaskContextType | undefined>(undefined);

interface CreateTaskProviderProps {
  children: ReactNode;
  tasks?: Task[]; // 任务列表，用于全局创建/编辑时的任务切换
}

/**
 * 全局创建任务提供者
 * 提供统一的创建任务侧边栏管理
 */
export function CreateTaskProvider({ children, tasks = [] }: CreateTaskProviderProps) {
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
        tasks={tasks}
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
