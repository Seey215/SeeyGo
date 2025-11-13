/**
 * 自定义 Hooks 集合
 * 用于连接 Zustand stores 和 React 组件
 */

import { useCallback, useMemo } from 'react';
import type { Filter, Task } from '@/lib/types';
import { filterTasks, sortByPriority } from '@/services/taskService';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useUIStore } from '@/stores/filtersStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useFiltersStore } from '@/stores/uiStore';

/**
 * 使用过滤后的任务列表
 */
export const useFilteredTasks = (): Task[] => {
  const tasks = useTasksStore(state => state.tasks);
  const filters = useFiltersStore();

  return useMemo(() => {
    const filtered = filterTasks(tasks, filters as Filter);
    return sortByPriority(filtered);
  }, [tasks, filters]);
};

/**
 * 使用任务操作
 */
export const useTaskActions = () => {
  const addTask = useTasksStore(state => state.addTask);
  const updateTask = useTasksStore(state => state.updateTask);
  const deleteTask = useTasksStore(state => state.deleteTask);
  const toggleTask = useTasksStore(state => state.toggleTask);

  return useCallback(
    () => ({
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
    }),
    [addTask, updateTask, deleteTask, toggleTask],
  ).call(null);
};

/**
 * 使用分类列表
 */
export const useCategories = () => {
  return useCategoriesStore(state => state.categories);
};

/**
 * 使用 UI 状态
 */
export const useUIState = () => {
  const sidebarOpen = useUIStore(state => state.sidebarOpen);
  const selectedTaskId = useUIStore(state => state.selectedTaskId);
  const editingTaskId = useUIStore(state => state.editingTaskId);
  const isLoading = useUIStore(state => state.isLoading);
  const error = useUIStore(state => state.error);
  const toast = useUIStore(state => state.toast);

  return {
    sidebarOpen,
    selectedTaskId,
    editingTaskId,
    isLoading,
    error,
    toast,
  };
};

/**
 * 使用 UI 操作
 */
export const useUIActions = () => {
  const setSidebarOpen = useUIStore(state => state.setSidebarOpen);
  const toggleSidebar = useUIStore(state => state.toggleSidebar);
  const setSelectedTaskId = useUIStore(state => state.setSelectedTaskId);
  const setEditingTaskId = useUIStore(state => state.setEditingTaskId);
  const setLoading = useUIStore(state => state.setLoading);
  const showToast = useUIStore(state => state.showToast);
  const closeToast = useUIStore(state => state.closeToast);

  return {
    setSidebarOpen,
    toggleSidebar,
    setSelectedTaskId,
    setEditingTaskId,
    setLoading,
    showToast,
    closeToast,
  };
};

/**
 * 使用任务统计
 */
export const useTaskStats = () => {
  const tasks = useTasksStore(state => state.tasks);

  return useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const incomplete = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      incomplete,
      completionRate: Math.round(completionRate),
    };
  }, [tasks]);
};
