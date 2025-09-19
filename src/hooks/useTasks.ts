import { useContext, useCallback } from 'react';
import { TaskContext } from '@/context/TaskContext';
import type { Task, TaskFormData } from '@/types';
import { createTask, updateTask, toggleTaskComplete } from '@/utils/taskUtils';

/**
 * 任务管理 Hook
 */
export function useTasks() {
  const context = useContext(TaskContext);
  
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }

  const { state, dispatch } = context;

  // 创建任务
  const createNewTask = useCallback((data: TaskFormData) => {
    const task = createTask(data);
    dispatch({ type: 'ADD_TASK', payload: task });
    return task;
  }, [dispatch]);

  // 更新任务
  const updateExistingTask = useCallback((taskId: string, updates: Partial<TaskFormData>) => {
    const existingTask = state.tasks.find(task => task.id === taskId);
    if (!existingTask) return null;

    const updatedTask = updateTask(existingTask, updates);
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    return updatedTask;
  }, [state.tasks, dispatch]);

  // 删除任务
  const deleteTask = useCallback((taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  }, [dispatch]);

  // 切换任务完成状态
  const toggleComplete = useCallback((taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  }, [dispatch]);

  // 批量操作
  const batchDelete = useCallback((taskIds: string[]) => {
    taskIds.forEach(id => {
      dispatch({ type: 'DELETE_TASK', payload: id });
    });
  }, [dispatch]);

  const batchToggleComplete = useCallback((taskIds: string[]) => {
    taskIds.forEach(id => {
      dispatch({ type: 'TOGGLE_TASK', payload: id });
    });
  }, [dispatch]);

  // 根据ID获取任务
  const getTaskById = useCallback((taskId: string): Task | undefined => {
    return state.tasks.find(task => task.id === taskId);
  }, [state.tasks]);

  return {
    tasks: state.tasks,
    createTask: createNewTask,
    updateTask: updateExistingTask,
    deleteTask,
    toggleComplete,
    batchDelete,
    batchToggleComplete,
    getTaskById,
  };
}