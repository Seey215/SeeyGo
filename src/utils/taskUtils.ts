import type { Priority, Task, TaskFilters } from '@/types';
import { isOverdue, isToday } from './dateUtils';

/**
 * 任务工具函数
 */

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 创建新的任务对象
 */
export function createTask(data: {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  categoryId?: string;
  tags?: string[];
}): Task {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: data.title,
    description: data.description,
    completed: false,
    priority: data.priority || 'medium',
    dueDate: data.dueDate,
    createdAt: now,
    updatedAt: now,
    categoryId: data.categoryId,
    tags: data.tags || [],
  };
}

/**
 * 更新任务对象
 */
export function updateTask(task: Task, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
  return {
    ...task,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * 切换任务完成状态
 */
export function toggleTaskComplete(task: Task): Task {
  return updateTask(task, { completed: !task.completed });
}

/**
 * 优先级数值映射（用于排序）
 */
const PRIORITY_VALUES: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * 获取优先级数值
 */
export function getPriorityValue(priority: Priority): number {
  return PRIORITY_VALUES[priority];
}

/**
 * 获取优先级显示文本
 */
export function getPriorityText(priority: Priority): string {
  const texts: Record<Priority, string> = {
    low: '低',
    medium: '中',
    high: '高',
  };
  return texts[priority];
}

/**
 * 获取优先级颜色类名
 */
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: 'text-blue-600 bg-blue-50',
    medium: 'text-amber-600 bg-amber-50',
    high: 'text-red-600 bg-red-50',
  };
  return colors[priority];
}

/**
 * 任务排序函数 - 默认按创建时间倒序排列（最新的在最上面）
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * 任务过滤函数 - 只支持搜索过滤
 */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter(task => {
    // 搜索过滤
    if (filters.search) {
      const searchText = filters.search.toLowerCase();
      if (
        !task.title.toLowerCase().includes(searchText)
        && !task.description?.toLowerCase().includes(searchText)
        && !task.tags.some(tag => tag.toLowerCase().includes(searchText))
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 获取今日任务
 */
export function getTodayTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    return isToday(new Date(task.dueDate));
  });
}

/**
 * 获取重要任务（高优先级或即将到期）
 */
export function getImportantTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => {
    // 高优先级任务
    if (task.priority === 'high') return true;

    // 即将到期的任务（3天内）
    if (task.dueDate) {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      const dueDate = new Date(task.dueDate);
      return dueDate <= threeDaysFromNow && !isOverdue(dueDate);
    }

    return false;
  });
}

/**
 * 获取已过期任务
 */
export function getOverdueTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => {
    return task.dueDate ? isOverdue(new Date(task.dueDate)) && !task.completed : false;
  });
}

/**
 * 统计任务数量
 */
export function getTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;
  const today = getTodayTasks(tasks).length;
  const important = getImportantTasks(tasks).length;
  const overdue = getOverdueTasks(tasks).length;

  return {
    total,
    completed,
    active,
    today,
    important,
    overdue,
  };
}

/**
 * 检查任务是否匹配搜索条件
 */
export function matchesSearch(task: Task, searchText: string): boolean {
  if (!searchText) return true;

  const search = searchText.toLowerCase();
  return (
    task.title.toLowerCase().includes(search)
    || task.description?.toLowerCase().includes(search)
    || task.tags.some(tag => tag.toLowerCase().includes(search))
  );
}
