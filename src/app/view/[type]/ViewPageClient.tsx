'use client';

import { useMemo } from 'react';
import { TaskList } from '@/components/tasks';
import { useFilters, useTasks } from '@/hooks';
import type { ViewType } from '@/types';
import { filterTasks, getImportantTasks, getTodayTasks, sortTasks } from '@/utils/taskUtils';

interface ViewPageClientProps {
  params: {
    type: string;
  };
}

/**
 * 统一视图页面客户端组件 - 处理所有任务视图
 */
export function ViewPageClient({ params }: ViewPageClientProps) {
  const { tasks } = useTasks();
  const { filters } = useFilters();

  // 解析视图类型和分类ID
  const { viewType, categoryId } = useMemo(() => {
    const type = params?.type;

    if (!type) {
      return { viewType: 'all' as ViewType };
    }

    if (type === 'all') {
      return { viewType: 'all' as ViewType };
    }

    if (type === 'today') {
      return { viewType: 'today' as ViewType };
    }

    if (type === 'important') {
      return { viewType: 'important' as ViewType };
    }

    if (type === 'completed') {
      return { viewType: 'completed' as ViewType };
    }

    if (type?.startsWith('category-')) {
      const categoryId = type.replace('category-', '');
      return { viewType: 'category' as ViewType, categoryId };
    }

    // 默认返回所有任务
    return { viewType: 'all' as ViewType };
  }, [params?.type]);

  // 根据视图类型过滤任务
  const filteredByView = useMemo(() => {
    let baseTasks = tasks;

    switch (viewType) {
      case 'today':
        baseTasks = getTodayTasks(tasks);
        break;
      case 'important':
        baseTasks = getImportantTasks(tasks);
        break;
      case 'completed':
        baseTasks = tasks.filter(task => task.completed);
        break;
      case 'category':
        if (categoryId) {
          baseTasks = tasks.filter(task => task.categoryId === categoryId);
        }
        break;
      default:
        baseTasks = tasks;
        break;
    }

    return baseTasks;
  }, [tasks, viewType, categoryId]);

  // 应用过滤器和排序
  const finalTasks = useMemo(() => {
    const filtered = filterTasks(filteredByView, filters);
    return sortTasks(filtered);
  }, [filteredByView, filters]);

  return (
    <div className="h-full flex flex-col">
      {/* 任务列表区域 */}
      <div className="flex-1 overflow-y-auto p-8">
        <TaskList
          tasks={finalTasks}
          emptyMessage={viewType === 'completed' ? '还没有已完成的任务' : '暂无任务'}
          emptyIcon={viewType === 'completed' ? '✅' : '📝'}
        />
      </div>
    </div>
  );
}
