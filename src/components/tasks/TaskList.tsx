'use client';

import { useState } from 'react';
import type { Task } from '@/types';
import { TaskFormModal } from './TaskFormModal';
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
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setEditingTask(undefined);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
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
        <button type="button" className="btn-gradient text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl">
          <svg
            className="w-5 h-5 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>添加图标</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          创建任务
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <TaskItem task={task} onEdit={handleEditTask} />
          </div>
        ))}
      </div>

      {/* 任务编辑模态框 */}
      <TaskFormModal isOpen={showTaskModal} onClose={handleCloseModal} task={editingTask} />
    </>
  );
}
