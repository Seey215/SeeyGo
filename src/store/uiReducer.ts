import type { FilterAction, UIAction, TaskSort } from '@/types';
import { DEFAULT_FILTERS } from '@/utils/constants';
import type { AppStoreState } from './types';

/**
 * UI和过滤器相关 reducer
 */
export function uiReducer(
  state: AppStoreState,
  action: FilterAction | UIAction | { type: 'SET_SORT'; payload: TaskSort },
): AppStoreState {
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
