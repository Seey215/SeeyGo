import type { FilterAction, UIAction } from '@/types';
import { DEFAULT_FILTERS } from '@/utils/constants';
import type { AppStoreState } from './types';

/**
 * UI和过滤器相关 reducer
 */
export function uiReducer(
  state: AppStoreState,
  action: FilterAction | UIAction,
): AppStoreState {
  switch (action.type) {
    // 过滤器相关
    case 'SET_SEARCH':
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
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
