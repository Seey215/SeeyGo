'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTasks } from '@/hooks';
import type { Task, TaskFormData } from '@/types';
import { TaskForm } from './TaskForm';

interface TaskEditSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  tasks?: Task[]; // 用于切换任务的列表
  defaultCategoryId?: string;
  defaultViewType?: string;
  onTaskChange?: (task: Task) => void; // 当用户切换任务时的回调
}

export function TaskEditSidebar({
  isOpen,
  onClose,
  task,
  tasks = [],
  defaultCategoryId,
  defaultViewType,
  onTaskChange,
}: TaskEditSidebarProps) {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = React.useState(false);

  // 处理 ESC 键关闭
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (data: TaskFormData) => {
    setLoading(true);
    try {
      if (task) {
        await updateTask(task.id, data);
      } else {
        await createTask(data);
      }
      onClose();
    } catch (error) {
      console.error('保存任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  // 获取当前任务的索引
  const currentTaskIndex = task ? tasks.findIndex(t => t.id === task.id) : -1;
  const canGoPrevious = currentTaskIndex > 0;
  const canGoNext = currentTaskIndex < tasks.length - 1 && currentTaskIndex >= 0;

  const handlePreviousTask = () => {
    if (canGoPrevious && tasks[currentTaskIndex - 1]) {
      const previousTask = tasks[currentTaskIndex - 1];
      onTaskChange?.(previousTask);
    }
  };

  const handleNextTask = () => {
    if (canGoNext && tasks[currentTaskIndex + 1]) {
      const nextTask = tasks[currentTaskIndex + 1];
      onTaskChange?.(nextTask);
    }
  };

  if (!isOpen) return null;

  const sidebarContent = (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景遮罩 */}
      <button
        type="button"
        className="fixed inset-0 bg-slate-900/50 backdrop-blur transition-opacity"
        onClick={onClose}
        aria-label="关闭侧边栏"
      />

      {/* 侧边栏 */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl slide-in-right">
        <div className="h-full overflow-y-auto flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/60 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 gradient-text">
                {task ? '编辑任务' : '创建新任务'}
              </h2>
              {task && tasks.length > 1 && (
                <p className="text-sm text-slate-500 mt-1">
                  {currentTaskIndex + 1} / {tasks.length}
                </p>
              )}
            </div>

            {/* 关闭按钮 */}
            <button
              type="button"
              onClick={onClose}
              className="ml-4 inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="关闭"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>关闭</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <TaskForm
              task={task}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              defaultCategoryId={defaultCategoryId}
              defaultViewType={defaultViewType}
            />
          </div>

          {/* 底部导航 - 仅在编辑模式且有多个任务时显示 */}
          {task && tasks.length > 1 && (
            <div className="border-t border-slate-200/60 p-4 flex-shrink-0 flex items-center gap-3 bg-slate-50">
              <button
                type="button"
                onClick={handlePreviousTask}
                disabled={!canGoPrevious || loading}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  bg-white border border-slate-200 text-slate-700
                  hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>上一个</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                上一个
              </button>

              <div className="text-sm text-slate-600 font-medium px-2 whitespace-nowrap">
                {currentTaskIndex + 1}/{tasks.length}
              </div>

              <button
                type="button"
                onClick={handleNextTask}
                disabled={!canGoNext || loading}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  bg-white border border-slate-200 text-slate-700
                  hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一个
                <svg
                  className="w-4 h-4 inline ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>下一个</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(sidebarContent, document.body);
}
