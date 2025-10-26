'use client';

import { useState } from 'react';
import type { OptimizeTaskResult } from '@/ai/types';
import { useAIOptimizeTask, useCategories, useTasks } from '@/hooks';
import type { TaskFormData } from '@/types';
import { TaskOptimizeModal } from '../ai/TaskOptimizeModal';

interface QuickCreateTaskProps {
  categoryId?: string;
}

/**
 * 快速创建任务输入框组件
 * 支持两种模式：
 * 1. 快速创建：按回车直接创建任务（默认中优先级）
 * 2. AI优化创建：Shift+回车触发AI优化，LLM智能提取优先级、日期、标签等
 */
export function QuickCreateTask({ categoryId }: QuickCreateTaskProps) {
  const { createTask } = useTasks();
  const { categories } = useCategories();
  const { optimize, isLoading: isOptimizing, error, result, reset } = useAIOptimizeTask();

  const [title, setTitle] = useState('');
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);

  // 获取当前分类名称
  const getCurrentCategoryName = () => {
    if (!categoryId) return undefined;
    return categories.find(cat => cat.id === categoryId)?.name;
  };

  // 直接创建任务（快速模式）
  const createTaskDirectly = (taskTitle: string) => {
    const taskData: TaskFormData = {
      title: taskTitle.trim(),
      description: '',
      priority: 'medium', // 默认中优先级
      dueDate: undefined, // 无截止时间
      categoryId: categoryId || undefined, // 当前选中分类或不分类
      tags: [],
    };

    createTask(taskData);
    setTitle('');
  };

  // 触发AI优化
  const handleAIOptimize = async (inputText: string) => {
    try {
      await optimize({
        userInput: inputText.trim(),
        categoryId: categoryId,
        categoryName: getCurrentCategoryName(),
      });
      setShowOptimizeModal(true);
    } catch (err) {
      console.error('AI优化失败:', err);
    }
  };

  // 确认AI优化后的任务
  const handleConfirmOptimized = (optimizedData: OptimizeTaskResult) => {
    const taskData: TaskFormData = {
      title: optimizedData.title,
      description: optimizedData.description || '',
      priority: optimizedData.priority || 'medium',
      dueDate: optimizedData.dueDate,
      categoryId: categoryId || undefined,
      tags: optimizedData.tags || [],
    };

    createTask(taskData);
    setTitle('');
    setShowOptimizeModal(false);
    reset();
  };

  // 处理键盘事件
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Shift + Enter: AI优化创建
    if ((e.shiftKey || e.metaKey) && e.key === 'Enter' && title.trim()) {
      e.preventDefault();
      await handleAIOptimize(title);
      return;
    }

    // Enter: 快速创建
    if (e.key === 'Enter' && title.trim() && !e.shiftKey) {
      e.preventDefault();
      createTaskDirectly(title);
      return;
    }

    // Escape: 清空输入框
    if (e.key === 'Escape') {
      setTitle('');
      setShowOptimizeModal(false);
      reset();
    }
  };

  return (
    <>
      <div className="px-8 py-6 border-t border-slate-200/60 bg-white">
        <div className="flex items-center space-x-3">
          {/* 快速创建按钮图标 */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>快速创建</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>

          {/* 输入框 */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="快速添加任务... 按 Enter 创建，Shift+Enter 由AI优化，Escape 取消"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isOptimizing}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg
                placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-0 focus:border-blue-400
                hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* 帮助提示 */}
          {title && (
            <div className="flex-shrink-0 text-xs text-slate-500">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100">
                {categoryId ? '📁 已归类' : '📝 无分类'}
              </span>
            </div>
          )}
        </div>

        {/* 说明文字 */}
        <p className="mt-2 text-xs text-slate-500" style={{ marginLeft: '52px' }}>
          ℹ️ <span className="font-semibold">快速创建：</span>Enter 键，默认中优先级、无截止时间
          {categoryId ? '，分类到当前目录' : ''}
          {' | '}
          <span className="font-semibold">AI优化：</span>Shift+Enter 键，由 AI 智能分析内容
        </p>
      </div>

      {/* AI优化Modal */}
      <TaskOptimizeModal
        isOpen={showOptimizeModal}
        isLoading={isOptimizing}
        optimizedData={result}
        error={error}
        onConfirm={handleConfirmOptimized}
        onCancel={() => {
          setShowOptimizeModal(false);
          reset();
        }}
      />
    </>
  );
}
