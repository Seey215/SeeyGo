import { useCallback, useContext } from 'react';
import { AppStoreContext } from '@/stores';
import type { Category, CategoryFormData } from '@/types';
import { generateId } from '@/utils/taskUtils';

/**
 * 分类管理 Hook
 */
export function useCategories() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useCategories must be used within an AppStoreProvider');
  }

  const { state, dispatch } = context;

  // 创建分类
  const createCategory = useCallback(
    (data: CategoryFormData) => {
      const now = new Date();
      const category: Category = {
        id: generateId(),
        name: data.name,
        color: data.color,
        taskCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_CATEGORY', payload: category });
      return category;
    },
    [dispatch],
  );

  // 更新分类
  const updateCategory = useCallback(
    (categoryId: string, updates: Partial<CategoryFormData>) => {
      const existingCategory = state.categories.find(cat => cat.id === categoryId);
      if (!existingCategory) return null;

      const updatedCategory: Category = {
        ...existingCategory,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
      return updatedCategory;
    },
    [state.categories, dispatch],
  );

  // 删除分类
  const deleteCategory = useCallback(
    (categoryId: string) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    },
    [dispatch],
  );

  // 根据ID获取分类
  const getCategoryById = useCallback(
    (categoryId: string): Category | undefined => {
      return state.categories.find(category => category.id === categoryId);
    },
    [state.categories],
  );

  // 获取分类名称
  const getCategoryName = useCallback(
    (categoryId?: string): string => {
      if (!categoryId) return '未分类';
      const category = getCategoryById(categoryId);
      return category?.name || '未知分类';
    },
    [getCategoryById],
  );

  return {
    categories: state.categories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryName,
  };
}
