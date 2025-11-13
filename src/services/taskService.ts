/**
 * Tasks Service - 处理任务数据逻辑
 * 包括数据转换、过滤、统计等纯业务逻辑
 */

import type { Filter, Task } from '@/lib/types';

/**
 * 根据过滤条件过滤任务列表
 */
export const filterTasks = (tasks: Task[], filters: Filter): Task[] => {
  let result = tasks;

  if (filters.completed !== undefined) {
    result = result.filter(task => task.completed === filters.completed);
  }

  if (filters.categoryId) {
    result = result.filter(task => task.categoryId === filters.categoryId);
  }

  if (filters.priority) {
    result = result.filter(task => task.priority === filters.priority);
  }

  if (filters.tags && filters.tags.length > 0) {
    result = result.filter(task => task.tags?.some(tag => filters.tags?.includes(tag)));
  }

  if (filters.searchQuery?.trim()) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(
      task =>
        task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query),
    );
  }

  return result;
};

/**
 * 按优先级排序任务
 */
export const sortByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort(
    (a, b) =>
      priorityOrder[a.priority as keyof typeof priorityOrder]
      - priorityOrder[b.priority as keyof typeof priorityOrder],
  );
};

/**
 * 按截止日期排序任务
 */
export const sortByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

/**
 * 按创建时间排序任务（最新优先）
 */
export const sortByCreatedDate = (tasks: Task[], ascending = false): Task[] => {
  return [...tasks].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return ascending ? -diff : diff;
  });
};

/**
 * 获取任务统计信息
 */
export const getTaskStats = (
  tasks: Task[],
): {
  total: number;
  completed: number;
  incomplete: number;
  completionRate: number;
  byPriority: Record<string, number>;
} => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const incomplete = total - completed;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  const byPriority = { high: 0, medium: 0, low: 0 };
  tasks.forEach(t => {
    byPriority[t.priority as keyof typeof byPriority]++;
  });

  return {
    total,
    completed,
    incomplete,
    completionRate,
    byPriority,
  };
};

/**
 * 获取即将到期的任务（7天内）
 */
export const getUpcomingTasks = (tasks: Task[]): Task[] => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= now && dueDate <= sevenDaysLater;
  });
};

/**
 * 获取逾期任务
 */
export const getOverdueTasks = (tasks: Task[]): Task[] => {
  const now = new Date();
  return tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < now;
  });
};

/**
 * 按某个字段分组任务
 */
export const groupTasksBy = (tasks: Task[], field: keyof Task): Record<string, Task[]> => {
  return tasks.reduce(
    (acc, task) => {
      const key = String(task[field]);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );
};
