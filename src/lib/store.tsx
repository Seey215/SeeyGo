'use client';

import type React from 'react';
import { createContext, type ReactNode, useEffect, useReducer } from 'react';
import type {
  AppState,
  Category,
  CategoryAction,
  CategoryFormData,
  FilterAction,
  Task,
  TaskAction,
  TaskFormData,
  TaskSort,
  UIAction,
} from '@/types';
import { DEFAULT_CATEGORIES } from '@/types';
import { DEFAULT_FILTERS, DEFAULT_SORT, DEFAULT_UI_STATE } from '@/utils/constants';
import { STORAGE_KEYS, serializer, storage } from '@/utils/storage';
import { generateId, toggleTaskComplete } from '@/utils/taskUtils';

// 合并的状态类型
interface AppStoreState {
  tasks: Task[];
  categories: Category[];
  filters: AppState['filters'];
  sort: TaskSort;
  ui: AppState['ui'];
}

// 合并的 Action 类型
type AppStoreAction =
  | TaskAction
  | CategoryAction
  | FilterAction
  | UIAction
  | { type: 'SET_SORT'; payload: TaskSort };

// Context 类型
interface AppStoreContextType {
  state: AppStoreState;
  dispatch: React.Dispatch<AppStoreAction>;
}

export const AppStoreContext = createContext<AppStoreContextType | null>(null);

// 初始状态
const initialState: AppStoreState = {
  tasks: [],
  categories: [],
  filters: DEFAULT_FILTERS,
  sort: DEFAULT_SORT,
  ui: DEFAULT_UI_STATE,
};

// 任务 reducer
function taskReducer(state: AppStoreState, action: TaskAction): AppStoreState {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => (task.id === action.payload.id ? action.payload : task)),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? toggleTaskComplete(task) : task,
        ),
      };

    default:
      return state;
  }
}

// 分类 reducer
function categoryReducer(state: AppStoreState, action: CategoryAction): AppStoreState {
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
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category,
        ),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };

    default:
      return state;
  }
}

// 过滤器和UI状态 reducer
function appStateReducer(
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

// 主 reducer
function appStoreReducer(state: AppStoreState, action: AppStoreAction): AppStoreState {
  // 任务相关 action
  if (
    ['SET_TASKS', 'ADD_TASK', 'UPDATE_TASK', 'DELETE_TASK', 'TOGGLE_TASK'].includes(action.type)
  ) {
    return taskReducer(state, action as TaskAction);
  }

  // 分类相关 action
  if (
    ['SET_CATEGORIES', 'ADD_CATEGORY', 'UPDATE_CATEGORY', 'DELETE_CATEGORY'].includes(action.type)
  ) {
    return categoryReducer(state, action as CategoryAction);
  }

  // 其他状态相关 action
  return appStateReducer(
    state,
    action as FilterAction | UIAction | { type: 'SET_SORT'; payload: TaskSort },
  );
}

// 序列化函数
function serializeTasks(tasks: Task[]): Record<string, unknown>[] {
  return tasks.map(task =>
    serializer.serializeWithDates(task as unknown as Record<string, unknown>, [
      'createdAt',
      'updatedAt',
      'dueDate',
    ]),
  );
}

function deserializeTasks(data: Record<string, unknown>[]): Task[] {
  return data.map(
    task =>
      serializer.deserializeWithDates(task, [
        'createdAt',
        'updatedAt',
        'dueDate',
      ]) as unknown as Task,
  );
}

function serializeCategories(categories: Category[]): Record<string, unknown>[] {
  return categories.map(category =>
    serializer.serializeWithDates(category as unknown as Record<string, unknown>, [
      'createdAt',
      'updatedAt',
    ]),
  );
}

function deserializeCategories(data: Record<string, unknown>[]): Category[] {
  return data.map(
    category =>
      serializer.deserializeWithDates(category, ['createdAt', 'updatedAt']) as unknown as Category,
  );
}

// 创建默认分类
function createDefaultCategories(): Category[] {
  const now = new Date();
  return DEFAULT_CATEGORIES.map(category => ({
    ...category,
    id: generateId(),
    taskCount: 0,
    createdAt: now,
    updatedAt: now,
  }));
}

interface AppStoreProviderProps {
  children: ReactNode;
}

export function AppStoreProvider({ children }: AppStoreProviderProps) {
  const [state, dispatch] = useReducer(appStoreReducer, initialState);

  // 从本地存储加载数据
  useEffect(() => {
    // 加载任务
    const storedTasks = storage.get(STORAGE_KEYS.TASKS, []);
    if (storedTasks.length > 0) {
      const tasks = deserializeTasks(storedTasks);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    }

    // 加载分类
    const storedCategories = storage.get(STORAGE_KEYS.CATEGORIES, []);
    if (storedCategories.length > 0) {
      const categories = deserializeCategories(storedCategories);
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } else {
      // 如果没有存储的分类，创建默认分类
      const defaultCategories = createDefaultCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: defaultCategories });
    }

    // 加载 UI 状态
    const storedUIState = storage.get(STORAGE_KEYS.UI_STATE, DEFAULT_UI_STATE);
    if (storedUIState) {
      dispatch({ type: 'SET_VIEW', payload: storedUIState.currentView });
      if (storedUIState.sidebarCollapsed !== DEFAULT_UI_STATE.sidebarCollapsed) {
        dispatch({ type: 'TOGGLE_SIDEBAR' });
      }
      dispatch({ type: 'SET_SHOW_COMPLETED', payload: storedUIState.showCompleted });
    }
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    if (state.tasks.length > 0) {
      const serializedTasks = serializeTasks(state.tasks);
      storage.set(STORAGE_KEYS.TASKS, serializedTasks);
    }
  }, [state.tasks]);

  useEffect(() => {
    if (state.categories.length > 0) {
      const serializedCategories = serializeCategories(state.categories);
      storage.set(STORAGE_KEYS.CATEGORIES, serializedCategories);
    }
  }, [state.categories]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.UI_STATE, state.ui);
  }, [state.ui]);

  return (
    <AppStoreContext.Provider value={{ state, dispatch }}>{children}</AppStoreContext.Provider>
  );
}
