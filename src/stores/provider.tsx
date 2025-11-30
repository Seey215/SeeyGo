'use client';

import type React from 'react';
import { createContext, type ReactNode, useEffect, useReducer } from 'react';
import type { Category, CategoryAction, FilterAction, Task, TaskAction, UIAction } from '@/types';
import { DEFAULT_CATEGORIES } from '@/types';
import { DEFAULT_FILTERS, DEFAULT_UI_STATE } from '@/utils/constants';
import { STORAGE_KEYS, serializer, storage } from '@/utils/storage';
import { generateId } from '@/utils/taskUtils';
import { categoryReducer } from './categoryReducer';
import type { AppStoreState } from './contextTypes';
import { taskReducer } from './taskReducer';
import { uiReducer } from './uiReducer';

type AppStoreAction = TaskAction | CategoryAction | FilterAction | UIAction;

interface AppStoreContextType {
  state: AppStoreState;
  dispatch: React.Dispatch<AppStoreAction>;
}

export const AppStoreContext = createContext<AppStoreContextType | null>(null);

const initialState: AppStoreState = {
  tasks: [],
  categories: [],
  filters: DEFAULT_FILTERS,
  ui: DEFAULT_UI_STATE,
};

function appStoreReducer(state: AppStoreState, action: AppStoreAction): AppStoreState {
  if (
    ['SET_TASKS', 'ADD_TASK', 'UPDATE_TASK', 'DELETE_TASK', 'TOGGLE_TASK'].includes(action.type)
  ) {
    return taskReducer(state, action as TaskAction);
  }

  if (
    ['SET_CATEGORIES', 'ADD_CATEGORY', 'UPDATE_CATEGORY', 'DELETE_CATEGORY'].includes(action.type)
  ) {
    return categoryReducer(state, action as CategoryAction);
  }

  return uiReducer(state, action as FilterAction | UIAction);
}

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

function createDefaultCategories(): Category[] {
  const now = new Date().toISOString();
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

  useEffect(() => {
    const storedTasks = storage.get(STORAGE_KEYS.TASKS, []);
    if (storedTasks.length > 0) {
      const tasks = deserializeTasks(storedTasks);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    }

    const storedCategories = storage.get(STORAGE_KEYS.CATEGORIES, []);
    if (storedCategories.length > 0) {
      const categories = deserializeCategories(storedCategories);
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } else {
      const defaultCategories = createDefaultCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: defaultCategories });
    }

    const storedUIState = storage.get(STORAGE_KEYS.UI_STATE, DEFAULT_UI_STATE);
    if (storedUIState) {
      dispatch({ type: 'SET_VIEW', payload: storedUIState.currentView });
      if (storedUIState.sidebarCollapsed !== DEFAULT_UI_STATE.sidebarCollapsed) {
        dispatch({ type: 'TOGGLE_SIDEBAR' });
      }
      dispatch({ type: 'SET_SHOW_COMPLETED', payload: storedUIState.showCompleted });
    }
  }, []);

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
