'use client';

import { useCallback, useState } from 'react';
import type { Task } from '@/types';
import { TaskEditSidebar } from './TaskEditSidebar';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
}

export function TaskList({
  tasks,
  loading = false,
  emptyMessage = '暂无任务',
  emptyIcon = '📝',
}: TaskListProps) {
  // 简化：使用本地状态管理编辑中的任务
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /**
   * 打开编辑侧边栏
   */
  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  /**
   * 关闭编辑侧边栏
   */
  const handleCloseSidebar = useCallback(() => {
    setEditingTask(null);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={`skeleton-${index + 1}`}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 skeleton rounded-lg"></div>
              <div className="flex-1">
                <div className="h-5 skeleton rounded w-3/4 mb-3"></div>
                <div className="h-4 skeleton rounded w-1/2 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 skeleton rounded-full w-12"></div>
                  <div className="h-6 skeleton rounded-full w-16"></div>
                  <div className="h-6 skeleton rounded-full w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl">{emptyIcon}</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 gradient-text">{emptyMessage}</h3>
        <p className="text-slate-500 mb-8 text-lg">开始创建你的第一个任务吧</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <TaskItem task={task} onEdit={handleEditTask} isEditing={editingTask?.id === task.id} />
          </div>
        ))}
      </div>

      {/* 任务编辑侧边栏 */}
      <TaskEditSidebar
        isOpen={editingTask !== null}
        onClose={handleCloseSidebar}
        task={editingTask ?? undefined}
      />
    </>
  );
}
