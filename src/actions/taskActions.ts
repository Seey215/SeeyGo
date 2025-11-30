/**
 * Task Actions - 集中处理任务相关的副作用
 * 包括创建、更新、删除任务，以及所有日志、指标、通知
 */

import { logger } from '@/lib/logger';
import { metrics } from '@/lib/metrics';
import { rafQueue } from '@/lib/rafQueue';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useUIStore } from '@/stores/uiStore';
import type { Task } from '@/types';

/**
 * 创建新任务
 */
export const createTaskAction = async (task: Task): Promise<Task | null> => {
  const timer = metrics.startTimer('task_creation');

  try {
    useTasksStore.getState().addTask(task);
    if (task.categoryId) {
      useCategoriesStore.getState().incrementTaskCount(task.categoryId);
    }

    logger.info('Task created successfully', {
      taskId: task.id,
      categoryId: task.categoryId,
    });

    timer();

    // 显示成功提示
    useUIStore.getState().showToast('任务创建成功', 'success');

    return task;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to create task', error as Error, { taskData: task });

    useUIStore.getState().showToast(`创建任务失败: ${errorMsg}`, 'error');
    return null;
  }
};

/**
 * 更新任务
 */
export const updateTaskAction = async (id: string, updates: Partial<Task>): Promise<boolean> => {
  const timer = metrics.startTimer('task_update');

  try {
    useTasksStore.getState().updateTask(id, updates);

    logger.info('Task updated successfully', { taskId: id });
    timer();

    useUIStore.getState().showToast('任务已更新', 'success');
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to update task', error as Error, { taskId: id, updates });

    useUIStore.getState().showToast(`更新任务失败: ${errorMsg}`, 'error');
    return false;
  }
};

/**
 * 删除任务
 */
export const deleteTaskAction = async (id: string): Promise<boolean> => {
  const timer = metrics.startTimer('task_deletion');

  try {
    const task = useTasksStore.getState().getTask(id);
    if (!task) {
      throw new Error('Task not found');
    }

    useTasksStore.getState().deleteTask(id);
    if (task.categoryId) {
      useCategoriesStore.getState().decrementTaskCount(task.categoryId);
    }

    logger.info('Task deleted successfully', { taskId: id });
    timer();

    useUIStore.getState().showToast('任务已删除', 'success');
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to delete task', error as Error, { taskId: id });

    useUIStore.getState().showToast(`删除任务失败: ${errorMsg}`, 'error');
    return false;
  }
};

/**
 * 切换任务完成状态
 */
export const toggleTaskCompletionAction = async (id: string): Promise<boolean> => {
  const timer = metrics.startTimer('task_completion_toggle');

  try {
    // 使用 RAF 队列处理 DOM 动画
    rafQueue(() => {
      useTasksStore.getState().toggleTask(id);
    });

    logger.info('Task completion toggled', { taskId: id });
    timer();

    return true;
  } catch (error) {
    logger.error('Failed to toggle task completion', error as Error, { taskId: id });
    return false;
  }
};

/**
 * 批量删除任务
 */
export const deleteMultipleTasksAction = async (ids: string[]): Promise<boolean> => {
  const timer = metrics.startTimer('batch_task_deletion');

  try {
    const tasks = useTasksStore.getState().tasks;
    const tasksByCategory: Record<string, number> = {};

    // 统计每个分类被删除的任务数
    ids.forEach(id => {
      const task = tasks.find(t => t.id === id);
      if (task?.categoryId) {
        tasksByCategory[task.categoryId] = (tasksByCategory[task.categoryId] || 0) + 1;
      }
    });

    // 更新任务
    useTasksStore.getState().deleteMultipleTasks(ids);

    // 更新分类计数
    Object.entries(tasksByCategory).forEach(([categoryId, count]) => {
      for (let i = 0; i < count; i++) {
        useCategoriesStore.getState().decrementTaskCount(categoryId);
      }
    });

    logger.info('Multiple tasks deleted', { count: ids.length });
    timer();

    useUIStore.getState().showToast(`已删除 ${ids.length} 个任务`, 'success');
    return true;
  } catch (error) {
    logger.error('Failed to delete multiple tasks', error as Error, {
      taskIds: ids,
    });

    useUIStore.getState().showToast('批量删除失败', 'error');
    return false;
  }
};
