import { useCallback, useState } from 'react';

/**
 * 统一的创建任务管理 Hook
 * 用于管理全局的创建任务模态框状态
 */
export function useCreateTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | undefined>(undefined);
  const [defaultViewType, setDefaultViewType] = useState<string | undefined>(undefined);

  const openCreateModal = useCallback((categoryId?: string, viewType?: string) => {
    setDefaultCategoryId(categoryId);
    setDefaultViewType(viewType);
    setIsOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsOpen(false);
    setDefaultCategoryId(undefined);
    setDefaultViewType(undefined);
  }, []);

  return {
    isOpen,
    defaultCategoryId,
    defaultViewType,
    openCreateModal,
    closeCreateModal,
  };
}
