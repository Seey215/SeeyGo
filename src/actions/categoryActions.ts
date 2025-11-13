/**
 * Category Actions - 集中处理分类相关的副作用
 */

import { logger } from '@/lib/logger';
import { metrics } from '@/lib/metrics';
import type { Category } from '@/lib/types';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useUIStore } from '@/stores/filtersStore';

/**
 * 创建新分类
 */
export const createCategoryAction = async (category: Category): Promise<Category | null> => {
  const timer = metrics.startTimer('category_creation');

  try {
    useCategoriesStore.getState().addCategory(category);
    logger.info('Category created successfully', { categoryId: category.id });

    timer();
    useUIStore.getState().showToast('分类创建成功', 'success');

    return category;
  } catch (error) {
    logger.error('Failed to create category', error as Error, { category });
    useUIStore.getState().showToast('创建分类失败', 'error');
    return null;
  }
};

/**
 * 更新分类
 */
export const updateCategoryAction = async (
  id: string,
  updates: Partial<Category>,
): Promise<boolean> => {
  const timer = metrics.startTimer('category_update');

  try {
    useCategoriesStore.getState().updateCategory(id, updates);
    logger.info('Category updated successfully', { categoryId: id });

    timer();
    useUIStore.getState().showToast('分类已更新', 'success');
    return true;
  } catch (error) {
    logger.error('Failed to update category', error as Error, { categoryId: id, updates });
    useUIStore.getState().showToast('更新分类失败', 'error');
    return false;
  }
};

/**
 * 删除分类
 */
export const deleteCategoryAction = async (id: string): Promise<boolean> => {
  const timer = metrics.startTimer('category_deletion');

  try {
    useCategoriesStore.getState().deleteCategory(id);
    logger.info('Category deleted successfully', { categoryId: id });

    timer();
    useUIStore.getState().showToast('分类已删除', 'success');
    return true;
  } catch (error) {
    logger.error('Failed to delete category', error as Error, { categoryId: id });
    useUIStore.getState().showToast('删除分类失败', 'error');
    return false;
  }
};
