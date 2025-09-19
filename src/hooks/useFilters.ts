import { useContext, useCallback } from 'react';
import { AppStateContext } from '@/context/AppStateContext';
import type { TaskFilters, TaskSort, Priority, TaskStatus } from '@/types';

/**
 * 过滤器管理 Hook
 */
export function useFilters() {
  const context = useContext(AppStateContext);
  
  if (!context) {
    throw new Error('useFilters must be used within an AppStateProvider');
  }

  const { state, dispatch } = context;

  // 设置搜索关键词
  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'SET_SEARCH', payload: search });
  }, [dispatch]);

  // 设置优先级过滤
  const setPriorityFilter = useCallback((priority: Priority | null) => {
    dispatch({ type: 'SET_PRIORITY_FILTER', payload: priority });
  }, [dispatch]);

  // 设置分类过滤
  const setCategoryFilter = useCallback((categoryId: string | null) => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: categoryId });
  }, [dispatch]);

  // 设置标签过滤
  const setTagFilter = useCallback((tags: string[]) => {
    dispatch({ type: 'SET_TAG_FILTER', payload: tags });
  }, [dispatch]);

  // 设置日期范围过滤
  const setDateFilter = useCallback((dateRange: [Date?, Date?]) => {
    dispatch({ type: 'SET_DATE_FILTER', payload: dateRange });
  }, [dispatch]);

  // 设置状态过滤
  const setStatusFilter = useCallback((status: TaskStatus | 'all') => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: status });
  }, [dispatch]);

  // 清空所有过滤器
  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, [dispatch]);

  // 设置排序
  const setSort = useCallback((sort: TaskSort) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  }, [dispatch]);

  // 切换排序方向
  const toggleSortOrder = useCallback(() => {
    const newOrder = state.sort.order === 'asc' ? 'desc' : 'asc';
    dispatch({ 
      type: 'SET_SORT', 
      payload: { ...state.sort, order: newOrder } 
    });
  }, [state.sort, dispatch]);

  // 检查是否有活动的过滤器
  const hasActiveFilters = useCallback(() => {
    const { search, priority, category, tags, dateRange, status } = state.filters;
    return !!(
      search ||
      priority ||
      category ||
      tags.length > 0 ||
      dateRange[0] ||
      dateRange[1] ||
      status !== 'all'
    );
  }, [state.filters]);

  return {
    filters: state.filters,
    sort: state.sort,
    setSearch,
    setPriorityFilter,
    setCategoryFilter,
    setTagFilter,
    setDateFilter,
    setStatusFilter,
    clearFilters,
    setSort,
    toggleSortOrder,
    hasActiveFilters,
  };
}