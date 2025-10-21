import type { CategoryAction } from '@/types';
import type { AppStoreState } from './types';

/**
 * 分类相关 reducer
 */
export function categoryReducer(state: AppStoreState, action: CategoryAction): AppStoreState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };

    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category: Category) =>
          category.id === action.payload.id ? action.payload : category,
        ),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((category: Category) => category.id !== action.payload),
      };

    default:
      return state;
  }
}
