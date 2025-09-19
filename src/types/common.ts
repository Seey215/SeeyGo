export interface Tag {
  id: string;
  name: string;
  usageCount: number;
  createdAt: Date;
}

export interface TagFormData {
  name: string;
}

// UI 相关类型
export type ViewType = 'all' | 'today' | 'important' | 'completed' | 'category';

export interface UIState {
  currentView: ViewType;
  sidebarCollapsed: boolean;
  showCompleted: boolean;
  activeModal: string | null;
}

// 应用状态接口
export interface AppState {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  filters: TaskFilters;
  sort: TaskSort;
  ui: UIState;
}

// 操作类型
export type TaskAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] };

export type CategoryAction =
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] };

export type TagAction =
  | { type: 'ADD_TAG'; payload: Tag }
  | { type: 'UPDATE_TAG'; payload: Tag }
  | { type: 'DELETE_TAG'; payload: string }
  | { type: 'SET_TAGS'; payload: Tag[] };

export type FilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PRIORITY_FILTER'; payload: Priority | null }
  | { type: 'SET_CATEGORY_FILTER'; payload: string | null }
  | { type: 'SET_TAG_FILTER'; payload: string[] }
  | { type: 'SET_DATE_FILTER'; payload: [Date?, Date?] }
  | { type: 'SET_STATUS_FILTER'; payload: TaskStatus | 'all' }
  | { type: 'CLEAR_FILTERS' };

export type UIAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SHOW_COMPLETED'; payload: boolean }
  | { type: 'SET_ACTIVE_MODAL'; payload: string | null };

// 导入依赖类型
import type { Task, TaskFilters, TaskSort, Priority, TaskStatus } from './task';
import type { Category } from './category';