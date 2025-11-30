/**
 * Categories Store - 使用 Zustand 管理分类状态
 */

import { create } from 'zustand';
import { logger } from '@/lib/logger';
import type { Category } from '@/types';
import { STORAGE_KEYS, storage } from '@/utils/storage';

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // 行为
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  incrementTaskCount: (id: string) => void;
  decrementTaskCount: (id: string) => void;

  // 查询
  getCategory: (id: string) => Category | undefined;
  getCategoryByName: (name: string) => Category | undefined;

  // 持久化
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => void;
  clearAll: () => void;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  setCategories: (categories: Category[]) => {
    set({ categories });
  },

  addCategory: (category: Category) => {
    set((state: CategoriesState) => ({
      categories: [...state.categories, category],
    }));
    get().saveToStorage();
    logger.info('Category added', { categoryId: category.id });
  },

  updateCategory: (id: string, updates: Partial<Category>) => {
    set((state: CategoriesState) => {
      const categories = state.categories.map((c: Category) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c,
      );
      return { categories };
    });
    get().saveToStorage();
    logger.info('Category updated', { categoryId: id });
  },

  deleteCategory: (id: string) => {
    set((state: CategoriesState) => ({
      categories: state.categories.filter((c: Category) => c.id !== id),
    }));
    get().saveToStorage();
    logger.info('Category deleted', { categoryId: id });
  },

  incrementTaskCount: (id: string) => {
    set((state: CategoriesState) => {
      const categories = state.categories.map((c: Category) =>
        c.id === id ? { ...c, taskCount: c.taskCount + 1, updatedAt: new Date().toISOString() } : c,
      );
      return { categories };
    });
    get().saveToStorage();
  },

  decrementTaskCount: (id: string) => {
    set((state: CategoriesState) => {
      const categories = state.categories.map((c: Category) =>
        c.id === id && c.taskCount > 0
          ? { ...c, taskCount: c.taskCount - 1, updatedAt: new Date().toISOString() }
          : c,
      );
      return { categories };
    });
    get().saveToStorage();
  },

  getCategory: (id: string) => {
    return get().categories.find((c: Category) => c.id === id);
  },

  getCategoryByName: (name: string) => {
    return get().categories.find((c: Category) => c.name === name);
  },

  loadFromStorage: async () => {
    try {
      set({ isLoading: true });
      const data = storage.get(STORAGE_KEYS.CATEGORIES, []) as unknown[];
      const categories = (data as Category[]) || [];
      set({ categories, isLoading: false });
      logger.debug('Categories loaded from storage', { count: categories.length });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMsg, isLoading: false });
      logger.error('Failed to load categories from storage', error as Error);
    }
  },

  saveToStorage: () => {
    try {
      const categories = get().categories;
      storage.set(STORAGE_KEYS.CATEGORIES, categories);
    } catch (error) {
      logger.error('Failed to save categories to storage', error as Error);
    }
  },

  clearAll: () => {
    set({
      categories: [],
      isLoading: false,
      error: null,
    });
    storage.remove(STORAGE_KEYS.CATEGORIES);
  },
}));
