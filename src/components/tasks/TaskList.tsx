'use client';

import { useEffect } from 'react';
import { useFiltersStore } from '@/stores';
import { useTasksStore } from '@/stores/tasksStore';
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
  // 从全局 UI Store 获取编辑状态
  const { editingTaskId, editModalOpen, openEditModal, closeEditModal } = useFiltersStore();

  // 从任务 Store 获取任务查询方法
  const { getTask } = useTasksStore();

  // 获取正在编辑的任务对象
  const editingTask = editingTaskId ? getTask(editingTaskId) : undefined;

  /**
   * 效果：当编辑的任务被删除时，自动关闭 Modal
   * 场景：用户在编辑中删除了其他地方的该任务
   */
  useEffect(() => {
    if (editingTaskId && !getTask(editingTaskId)) {
      closeEditModal();
    }
  }, [editingTaskId, getTask, closeEditModal]);

  /**
   * 处理任务点击事件
   */
  const handleEditTask = (task: Task) => {
    openEditModal(task.id);
  };

  /**
   * 处理外部点击关闭 Modal
   */
  useEffect(() => {
    if (!editModalOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 如果点击在任务项上，不处理（让 openEditModal 处理切换）
      if (target.closest('button[class*="card-hover"]')) {
        return;
      }

      // 如果点击在侧边栏上，不处理
      if (target.closest('[role="complementary"], .slide-in-right')) {
        return;
      }

      // 其他外部点击，关闭 Modal
      closeEditModal();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editModalOpen, closeEditModal]);

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
            <TaskItem
              task={task}
              onEdit={handleEditTask}
              isEditing={editingTaskId === task.id && editModalOpen}
            />
          </div>
        ))}
      </div>

      {/* 任务编辑侧边栏 */}
      <TaskEditSidebar isOpen={editModalOpen} onClose={closeEditModal} task={editingTask} />
    </>
  );
}
