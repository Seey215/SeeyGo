import { useCallback, useContext } from 'react';
import { AppStoreContext } from '@/store';

/**
 * 搜索管理 Hook
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

  return {
    filters: state.filters,
    setSearch,
  };
}
