'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTasks } from '@/hooks';
import type { Task, TaskFormData } from '@/types';
import { TaskForm, type TaskFormRef } from './TaskForm';

interface TaskEditSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  defaultCategoryId?: string;
  defaultViewType?: string;
}

export function TaskEditSidebar({
  isOpen,
  onClose,
  task,
  defaultCategoryId,
  defaultViewType,
}: TaskEditSidebarProps) {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = React.useState(false);
  const formRef = useRef<TaskFormRef>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 处理点击外部区域失焦时保存并关闭
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // 获取当前表单数据并保存
        if (formRef.current && task) {
          const formData = formRef.current.getCurrentFormData();
          // 只有在标题不为空时才保存
          if (formData.title.trim()) {
            try {
              await updateTask(task.id, formData);
            } catch (error) {
              console.error('保存任务失败:', error);
            }
          }
        }
        onClose();
      }
    };

    if (isOpen) {
      // 使用 setTimeout 延迟添加监听器，避免立即触发
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose, task, updateTask]);

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

  if (!isOpen) return null;

  const sidebarContent = (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 侧边栏 - 无背景遮罩，用户可继续操作背后的元素 */}
      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl slide-in-right"
      >
        <div className="h-full overflow-y-auto flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/60 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 gradient-text">
                {task ? '编辑任务' : '创建新任务'}
              </h2>
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
              ref={formRef}
              task={task}
              onSubmit={handleSubmit}
              loading={loading}
              defaultCategoryId={defaultCategoryId}
              defaultViewType={defaultViewType}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(sidebarContent, document.body);
}
