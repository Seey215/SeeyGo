import { useCallback, useContext } from 'react';
import type { Priority, TaskSort, TaskStatus } from '@/types';
import { AppStoreContext } from '@/store';

/**
 * 过滤器和排序管理 Hook
 */
export function useFilters() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useFilters must be used within an AppStoreProvider');
  }

  const { state, dispatch } = context;

  // 设置搜索
  const setSearch = useCallback(
    (search: string) => {
      dispatch({ type: 'SET_SEARCH', payload: search });
    },
    [dispatch],
  );

  // 设置优先级过滤
  const setPriorityFilter = useCallback(
    (priority: Priority | null) => {
      dispatch({ type: 'SET_PRIORITY_FILTER', payload: priority });
    },
    [dispatch],
  );

  // 设置分类过滤
  const setCategoryFilter = useCallback(
    (category: string | null) => {
      dispatch({ type: 'SET_CATEGORY_FILTER', payload: category });
    },
    [dispatch],
  );

  // 设置标签过滤
  const setTagFilter = useCallback(
    (tags: string[]) => {
      dispatch({ type: 'SET_TAG_FILTER', payload: tags });
    },
    [dispatch],
  );

  // 设置日期过滤
  const setDateFilter = useCallback(
    (dateRange: [Date?, Date?]) => {
      dispatch({ type: 'SET_DATE_FILTER', payload: dateRange });
    },
    [dispatch],
  );

  // 设置状态过滤
  const setStatusFilter = useCallback(
    (status: TaskStatus | 'all') => {
      dispatch({ type: 'SET_STATUS_FILTER', payload: status });
    },
    [dispatch],
  );

  // 清空过滤器
  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, [dispatch]);

  // 设置排序
  const setSort = useCallback(
    (sort: TaskSort) => {
      dispatch({ type: 'SET_SORT', payload: sort });
    },
    [dispatch],
  );

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
  };
}
