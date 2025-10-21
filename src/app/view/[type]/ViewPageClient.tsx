'use client';

import { useMemo } from 'react';
import { TaskList } from '@/components/tasks';
import { useCategories, useFilters, useTasks } from '@/hooks';
import type { ViewType } from '@/types';
import {
  filterTasks,
  getImportantTasks,
  getTaskStats,
  getTodayTasks,
  sortTasks,
} from '@/utils/taskUtils';

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
  const { categories } = useCategories();
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

  // 计算统计数据
  const stats = getTaskStats(finalTasks);

  // 获取页面标题
  const getPageTitle = () => {
    switch (viewType) {
      case 'today':
        return '今日任务';
      case 'important':
        return '重要任务';
      case 'completed':
        return '已完成任务';
      case 'category': {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? `${category.name} 分类` : '分类任务';
      }
      default:
        return '所有任务';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 页面头部 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 gradient-text">{getPageTitle()}</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              共 <span className="font-bold text-slate-700">{stats.total}</span> 个任务，
              <span className="font-bold text-blue-600">{stats.active}</span> 个进行中，
              <span className="font-bold text-emerald-600">{stats.completed}</span> 个已完成
            </p>
          </div>
        </div>
      </div>

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
