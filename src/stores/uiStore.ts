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
}));
