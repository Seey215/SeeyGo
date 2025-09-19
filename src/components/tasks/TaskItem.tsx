'use client';

import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { formatRelativeTime, isOverdue } from '@/utils/dateUtils';
import { getPriorityColor } from '@/utils/taskUtils';
import type { Task } from '@/types';

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
    <div className={`bg-white rounded-lg border transition-all duration-200 ${
      task.completed 
        ? 'border-gray-200 opacity-75' 
        : isTaskOverdue 
        ? 'border-red-200 bg-red-50' 
        : 'border-gray-200 hover:shadow-md'
    } ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* 任务状态复选框 */}
          <button
            onClick={handleToggleComplete}
            disabled={isDeleting}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
            }`}
          >
            {task.completed && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* 任务内容 */}
          <div className="flex-1 min-w-0">
            {/* 任务标题 */}
            <h3 className={`font-medium text-sm transition-all ${
              task.completed 
                ? 'text-gray-500 line-through' 
                : isTaskOverdue 
                ? 'text-red-900' 
                : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            
            {/* 任务描述 */}
            {task.description && (
              <p className={`mt-1 text-sm ${
                task.completed 
                  ? 'text-gray-400' 
                  : isTaskOverdue 
                  ? 'text-red-700' 
                  : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            
            {/* 任务元信息 */}
            <div className="flex items-center flex-wrap gap-2 mt-3">
              {/* 优先级标签 */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
              </span>
              
              {/* 分类标签 */}
              {task.categoryId && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  📁 {getCategoryName(task.categoryId)}
                </span>
              )}
              
              {/* 截止日期 */}
              {task.dueDate && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isTaskOverdue 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  📅 {task.dueDate.toLocaleDateString('zh-CN')}
                  {isTaskOverdue && ' (已逾期)'}
                </span>
              )}
              
              {/* 创建时间 */}
              <span className="inline-flex items-center text-xs text-gray-500">
                ⏰ {formatRelativeTime(task.createdAt)}
              </span>
            </div>
            
            {/* 标签列表 */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
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
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="编辑任务"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="删除任务"
            >
              {isDeleting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}