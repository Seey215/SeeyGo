'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks';
import type { TaskFormData } from '@/types';

interface QuickCreateTaskProps {
  categoryId?: string;
}

/**
 * 快速创建任务输入框组件
 * 用户只需输入标题，按回车即可创建任务
 * 默认使用中优先级、无截止时间、当前选中分类
 */
export function QuickCreateTask({ categoryId }: QuickCreateTaskProps) {
  const { createTask } = useTasks();
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 按回车创建任务
    if (e.key === 'Enter' && title.trim()) {
      e.preventDefault();
      setIsLoading(true);

      try {
        const taskData: TaskFormData = {
          title: title.trim(),
          description: '',
          priority: 'medium', // 默认中优先级
          dueDate: undefined, // 无截止时间
          categoryId: categoryId || undefined, // 当前选中分类或不分类
          tags: [],
        };

        createTask(taskData);

        // 清空输入框
        setTitle('');
      } catch (error) {
        console.error('创建任务失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Escape 清空输入框
    if (e.key === 'Escape') {
      setTitle('');
    }
  };

  return (
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
            placeholder="快速添加任务... 按 Enter 创建，Escape 取消"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
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
        ℹ️ 快速创建：只需输入标题即可，默认为<span className="font-semibold">中优先级</span>，
        <span className="font-semibold">无截止时间</span>
        {categoryId ? '，将被分类到当前目录' : ''}
      </p>
    </div>
  );
}
