/**
 * Filters Store - 使用 Zustand 管理筛选状态
 */

import { create } from 'zustand';
import { logger } from '@/lib/logger';
import type { Filter } from '@/lib/types';

interface FiltersState extends Filter {
  // 行为
  setFilters: (filters: Filter) => void;
  setCategoryFilter: (categoryId: string | undefined) => void;
  setCompletedFilter: (completed: boolean | undefined) => void;
  setPriorityFilter: (priority: Filter['priority']) => void;
  setTagsFilter: (tags: string[] | undefined) => void;
  setSearchQuery: (query: string | undefined) => void;
  clearFilters: () => void;

  // 新增：任务编辑状态
  editingTaskId: string | null;
  editModalOpen: boolean;
  openEditModal: (taskId: string) => void;
  closeEditModal: () => void;
  toggleEditModal: (taskId: string) => void;
}

const defaultFilters: Filter = {
  categoryId: undefined,
  completed: undefined,
  priority: undefined,
  tags: undefined,
  searchQuery: undefined,
};

export const useFiltersStore = create<FiltersState>(set => ({
  ...defaultFilters,

  // 新增：编辑状态初始值
  editingTaskId: null,
  editModalOpen: false,

  setFilters: (filters: Filter) => {
    set(filters);
    logger.debug('Filters updated');
  },

  setCategoryFilter: (categoryId: string | undefined) => {
    set({ categoryId });
  },

  setCompletedFilter: (completed: boolean | undefined) => {
    set({ completed });
  },

  setPriorityFilter: (priority: Filter['priority']) => {
    set({ priority });
  },

  setTagsFilter: (tags: string[] | undefined) => {
    set({ tags });
  },

  setSearchQuery: (query: string | undefined) => {
    set({ searchQuery: query });
  },

  clearFilters: () => {
    set(defaultFilters);
    logger.debug('Filters cleared');
  },

  // 新增：打开编辑 Modal
  openEditModal: (taskId: string) => {
    logger.debug('Opening edit modal for task', { taskId });
    set({ editingTaskId: taskId, editModalOpen: true });
  },

  // 新增：关闭编辑 Modal
  closeEditModal: () => {
    logger.debug('Closing edit modal');
    set({ editModalOpen: false });
  },

  // 新增：切换编辑 Modal
  // 行为：直接打开指定任务，不管之前的状态
  toggleEditModal: (taskId: string) => {
    logger.debug('Opening/switching to task', { taskId });
    set({ editingTaskId: taskId, editModalOpen: true });
  },
}));
