/**
 * Categories Service - 处理分类数据逻辑
 */

import type { Category } from '@/lib/types';

/**
 * 按任务数量排序分类
 */
export const sortCategoriesByTaskCount = (
  categories: Category[],
  descending = true,
): Category[] => {
  return [...categories].sort((a, b) =>
    descending ? b.taskCount - a.taskCount : a.taskCount - b.taskCount,
  );
};

/**
 * 按名称排序分类
 */
export const sortCategoriesByName = (categories: Category[], ascending = true): Category[] => {
  return [...categories].sort((a, b) =>
    ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );
};

/**
 * 根据名称查找分类
 */
export const findCategoryByName = (categories: Category[], name: string): Category | undefined => {
  return categories.find(c => c.name.toLowerCase() === name.toLowerCase());
};

/**
 * 获取分类的颜色（用于 UI）
 */
export const getCategoryColor = (category: Category): string => {
  return category.color || '#999999';
};

/**
 * 验证分类名称是否有效
 */
export const isValidCategoryName = (name: string): boolean => {
  return name.trim().length > 0 && name.length <= 50;
};

/**
 * 获取分类统计信息
 */
export const getCategoryStats = (
  categories: Category[],
): {
  total: number;
  avgTaskCount: number;
  maxTaskCount: number;
  minTaskCount: number;
} => {
  if (categories.length === 0) {
    return { total: 0, avgTaskCount: 0, maxTaskCount: 0, minTaskCount: 0 };
  }

  const total = categories.length;
  const taskCounts = categories.map(c => c.taskCount);
  const sumTaskCount = taskCounts.reduce((a, b) => a + b, 0);
  const avgTaskCount = sumTaskCount / total;
  const maxTaskCount = Math.max(...taskCounts);
  const minTaskCount = Math.min(...taskCounts);

  return { total, avgTaskCount, maxTaskCount, minTaskCount };
};
