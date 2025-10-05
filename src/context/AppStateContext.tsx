'use client';

import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import type { AppState, TaskSort, FilterAction, UIAction } from '@/types';
import { DEFAULT_FILTERS, DEFAULT_SORT, DEFAULT_UI_STATE } from '@/utils/constants';
import { storage, STORAGE_KEYS } from '@/utils/storage';

type AppAction = FilterAction | UIAction | { type: 'SET_SORT'; payload: TaskSort };

interface AppStateContextType {
  state: Pick<AppState, 'filters' | 'sort' | 'ui'>;
  dispatch: React.Dispatch<AppAction>;
}

export const AppStateContext = createContext<AppStateContextType | null>(null);

// 应用状态初始值
const initialState: Pick<AppState, 'filters' | 'sort' | 'ui'> = {
  filters: DEFAULT_FILTERS,
  sort: DEFAULT_SORT,
  ui: DEFAULT_UI_STATE,
};

// 应用状态 reducer
function appStateReducer(
  state: Pick<AppState, 'filters' | 'sort' | 'ui'>,
  action: AppAction,
): Pick<AppState, 'filters' | 'sort' | 'ui'> {
  switch (action.type) {
    // 过滤器相关
    case 'SET_SEARCH':
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
      };

    case 'SET_PRIORITY_FILTER':
      return {
        ...state,
        filters: { ...state.filters, priority: action.payload },
      };

    case 'SET_CATEGORY_FILTER':
      return {
        ...state,
        filters: { ...state.filters, category: action.payload },
      };

    case 'SET_TAG_FILTER':
      return {
        ...state,
        filters: { ...state.filters, tags: action.payload },
      };

    case 'SET_DATE_FILTER':
      return {
        ...state,
        filters: { ...state.filters, dateRange: action.payload },
      };

    case 'SET_STATUS_FILTER':
      return {
        ...state,
        filters: { ...state.filters, status: action.payload },
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: DEFAULT_FILTERS,
      };

    // 排序相关
    case 'SET_SORT':
      return {
        ...state,
        sort: action.payload,
      };

    // UI 状态相关
    case 'SET_VIEW':
      return {
        ...state,
        ui: { ...state.ui, currentView: action.payload },
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
      };

    case 'SET_SHOW_COMPLETED':
      return {
        ...state,
        ui: { ...state.ui, showCompleted: action.payload },
      };

    case 'SET_ACTIVE_MODAL':
      return {
        ...state,
        ui: { ...state.ui, activeModal: action.payload },
      };

    default:
      return state;
  }
}

interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  // 从本地存储加载 UI 状态
  useEffect(() => {
    const storedUIState = storage.get(STORAGE_KEYS.UI_STATE, DEFAULT_UI_STATE);
    if (storedUIState) {
      dispatch({ type: 'SET_VIEW', payload: storedUIState.currentView });
      if (storedUIState.sidebarCollapsed !== DEFAULT_UI_STATE.sidebarCollapsed) {
        dispatch({ type: 'TOGGLE_SIDEBAR' });
      }
      dispatch({ type: 'SET_SHOW_COMPLETED', payload: storedUIState.showCompleted });
    }
  }, []);

  // UI 状态变化时保存到本地存储
  useEffect(() => {
    storage.set(STORAGE_KEYS.UI_STATE, state.ui);
  }, [state.ui]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
  );
}
