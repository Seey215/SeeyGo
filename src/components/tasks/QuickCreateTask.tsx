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
      {/* 快速创建任务卡片 - 与TaskList风格一致 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            {/* 快速创建按钮图标 */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>快速创建</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>

            {/* 输入框 */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="快速添加任务..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isOptimizing}
                className="w-full px-3 py-2 text-base bg-transparent border-0 
                  placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-0
                  disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              />
            </div>

            {/* 状态提示 */}
            {title && (
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                    {categoryId ? '📁 已归类' : '📝 无分类'}
                  </span>
                  {isOptimizing && (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 快捷键提示 */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">
                    Enter
                  </kbd>
                  <span>快速创建</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <kbd className="px-2 py-0.5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded text-blue-700 font-mono">
                    Shift+Enter
                  </kbd>
                  <span>AI优化</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">
                    Esc
                  </kbd>
                  <span>取消</span>
                </span>
              </div>
              {categoryId && <span className="text-slate-400">✨ 将自动分类到当前目录</span>}
            </div>
          </div>
        </div>
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
