/**
 * Tasks Store - 使用 Zustand 管理任务状态
 * 提供细粒度的任务管理与性能优化
 */

import { create } from 'zustand';
import { logger } from '@/lib/logger';
import type { Task } from '@/lib/types';
import { STORAGE_KEYS, storage } from '@/utils/storage';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // 行为
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  deleteMultipleTasks: (ids: string[]) => void;

  // 查询
  getTask: (id: string) => Task | undefined;
  getTasksByCategory: (categoryId: string) => Task[];
  getTasksByPriority: (priority: Task['priority']) => Task[];
  getCompletedTasks: () => Task[];
  getIncompleteTasks: () => Task[];

  // 持久化
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => void;
  clearAll: () => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks: Task[]) => {
    set({ tasks });
  },

  addTask: (task: Task) => {
    set((state: TasksState) => ({
      tasks: [...state.tasks, task],
    }));
    get().saveToStorage();
    logger.info('Task added', { taskId: task.id });
  },

  updateTask: (id: string, updates: Partial<Task>) => {
    set((state: TasksState) => {
      const tasks = state.tasks.map((t: Task) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t,
      );
      return { tasks };
    });
    get().saveToStorage();
    logger.info('Task updated', { taskId: id });
  },

  deleteTask: (id: string) => {
    set((state: TasksState) => ({
      tasks: state.tasks.filter((t: Task) => t.id !== id),
    }));
    get().saveToStorage();
    logger.info('Task deleted', { taskId: id });
  },

  toggleTask: (id: string) => {
    set((state: TasksState) => {
      const tasks = state.tasks.map((t: Task) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t,
      );
      return { tasks };
    });
    get().saveToStorage();
  },

  deleteMultipleTasks: (ids: string[]) => {
    set((state: TasksState) => ({
      tasks: state.tasks.filter((t: Task) => !ids.includes(t.id)),
    }));
    get().saveToStorage();
    logger.info('Multiple tasks deleted', { count: ids.length });
  },

  getTask: (id: string) => {
    return get().tasks.find((t: Task) => t.id === id);
  },

  getTasksByCategory: (categoryId: string) => {
    return get().tasks.filter((t: Task) => t.categoryId === categoryId);
  },

  getTasksByPriority: (priority: Task['priority']) => {
    return get().tasks.filter((t: Task) => t.priority === priority);
  },

  getCompletedTasks: () => {
    return get().tasks.filter((t: Task) => t.completed);
  },

  getIncompleteTasks: () => {
    return get().tasks.filter((t: Task) => !t.completed);
  },

  loadFromStorage: async () => {
    try {
      set({ isLoading: true });
      const data = storage.get(STORAGE_KEYS.TASKS, []) as unknown[];
      const tasks = (data as Task[]) || [];
      set({ tasks, isLoading: false });
      logger.debug('Tasks loaded from storage', { count: tasks.length });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMsg, isLoading: false });
      logger.error('Failed to load tasks from storage', error as Error);
    }
  },

  saveToStorage: () => {
    try {
      const tasks = get().tasks;
      storage.set(STORAGE_KEYS.TASKS, tasks);
    } catch (error) {
      logger.error('Failed to save tasks to storage', error as Error);
    }
  },

  clearAll: () => {
    set({
      tasks: [],
      isLoading: false,
      error: null,
    });
    storage.remove(STORAGE_KEYS.TASKS);
  },
}));
