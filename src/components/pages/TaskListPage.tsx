'use client';

import React, { useMemo, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { useFilters } from '@/hooks/useFilters';
import { TaskList, TaskFormModal } from '@/components/tasks';
import { FilterPanel } from '@/components/filters';
import { Button } from '@/components/ui';
import {
  filterTasks,
  sortTasks,
  getTodayTasks,
  getImportantTasks,
  getTaskStats,
} from '@/utils/taskUtils';
import type { TaskStatus, ViewType } from '@/types';

interface TaskListPageProps {
  viewType: ViewType;
  categoryId?: string;
}

/**
 * 任务列表页面组件
 */
export function TaskListPage({ viewType, categoryId }: TaskListPageProps) {
  const { tasks } = useTasks();
  const { categories } = useCategories();
  const { filters, sort } = useFilters();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

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
      case 'all':
      default:
        baseTasks = tasks;
        break;
    }

    return baseTasks;
  }, [tasks, viewType, categoryId]);

  // 应用过滤器和排序
  const finalTasks = useMemo(() => {
    const filtered = filterTasks(filteredByView, filters, categories);
    return sortTasks(filtered, sort);
  }, [filteredByView, filters, sort, categories]);

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
      case 'category':
        const category = categories.find(cat => cat.id === categoryId);
        return category ? `${category.name} 分类` : '分类任务';
      case 'all':
      default:
        return '所有任务';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h2>
            <p className="text-sm text-gray-500 mt-1">
              共 {stats.total} 个任务，{stats.active} 个进行中，{stats.completed} 个已完成
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setShowFilterPanel(true)}>
              筛选
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>+ 新建任务</Button>
          </div>
        </div>
      </div>

      {/* 任务列表区域 */}
      <div className="flex-1 overflow-y-auto p-6">
        <TaskList
          tasks={finalTasks}
          emptyMessage={viewType === 'completed' ? '还没有已完成的任务' : '暂无任务'}
          emptyIcon={viewType === 'completed' ? '✅' : '📝'}
        />
      </div>

      {/* 创建任务模态框 */}
      <TaskFormModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* 过滤面板 */}
      <FilterPanel isOpen={showFilterPanel} onClose={() => setShowFilterPanel(false)} />
    </div>
  );
}
