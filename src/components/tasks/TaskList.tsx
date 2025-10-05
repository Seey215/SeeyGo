'use client';

import React, { useState } from 'react';
import { TaskItem } from './TaskItem';
import { TaskFormModal } from './TaskFormModal';
import type { Task } from '@/types';

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
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex space-x-2">
                  <div className="h-5 bg-gray-200 rounded w-12"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
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
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <span className="text-6xl">{emptyIcon}</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500 mb-6">开始创建你的第一个任务吧</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
        ))}
      </div>

      {/* 任务编辑模态框 */}
      <TaskFormModal isOpen={showTaskModal} onClose={handleCloseModal} task={editingTask} />
    </>
  );
}
