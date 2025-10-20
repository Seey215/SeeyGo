'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/types';
import { formatRelativeTime, isOverdue } from '@/utils/dateUtils';
import { getPriorityColor } from '@/utils/taskUtils';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleComplete, deleteTask } = useTasks();
  const { getCategoryName } = useCategories();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = () => {
    toggleComplete(task.id);
  };

  const handleDelete = async () => {
    if (confirm('确定要删除这个任务吗？')) {
      setIsDeleting(true);
      try {
        deleteTask(task.id);
      } catch (error) {
        console.error('删除任务失败:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && !task.completed;

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 card-hover ${
        task.completed
          ? 'border-slate-200 opacity-75'
          : isTaskOverdue
            ? 'border-red-200 bg-red-50'
            : 'border-slate-200 shadow-sm'
      } ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* 任务状态复选框 */}
          <button
            onClick={handleToggleComplete}
            disabled={isDeleting}
            className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all checkbox-animate ${
              task.completed
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-md'
                : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50'
            }`}
          >
            {task.completed && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <title>完成标记</title>
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* 任务内容 */}
          <div className="flex-1 min-w-0">
            {/* 任务标题 */}
            <h3
              className={`font-semibold text-base transition-all ${
                task.completed
                  ? 'text-slate-500 line-through'
                  : isTaskOverdue
                    ? 'text-red-900'
                    : 'text-slate-900'
              }`}
            >
              {task.title}
            </h3>

            {/* 任务描述 */}
            {task.description && (
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  task.completed
                    ? 'text-slate-400'
                    : isTaskOverdue
                      ? 'text-red-700'
                      : 'text-slate-600'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* 任务元信息 */}
            <div className="flex items-center flex-wrap gap-2 mt-4">
              {/* 优先级标签 */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getPriorityColor(task.priority)}`}
              >
                {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
              </span>

              {/* 分类标签 */}
              {task.categoryId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                    />
                  </svg>
                  {getCategoryName(task.categoryId)}
                </span>
              )}

              {/* 截止日期 */}
              {task.dueDate && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    isTaskOverdue
                      ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                      : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700'
                  }`}
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {task.dueDate.toLocaleDateString('zh-CN')}
                  {isTaskOverdue && ' (已逾期)'}
                </span>
              )}

              {/* 创建时间 */}
              <span className="inline-flex items-center text-xs text-slate-500">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatRelativeTime(task.createdAt)}
              </span>
            </div>

            {/* 标签列表 */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(task)}
              disabled={isDeleting}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover-scale"
              title="编辑任务"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover-scale"
              title="删除任务"
            >
              {isDeleting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
