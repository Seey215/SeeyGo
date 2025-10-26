'use client';

import { useState } from 'react';
import type { OptimizeTaskResult } from '@/ai/types';
import type { Priority } from '@/types';
import { Modal } from '../ui/Modal';

interface TaskOptimizeModalProps {
  isOpen: boolean;
  isLoading: boolean;
  optimizedData: OptimizeTaskResult | null;
  error: string | null;
  onConfirm: (data: OptimizeTaskResult) => void;
  onCancel: () => void;
}

/**
 * 任务优化预览Modal组件
 * 显示AI优化的任务结果，允许用户确认或编辑
 */
export function TaskOptimizeModal({
  isOpen,
  isLoading,
  optimizedData,
  error,
  onConfirm,
  onCancel,
}: TaskOptimizeModalProps) {
  const [editedData, setEditedData] = useState<OptimizeTaskResult | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const titleInputId = 'task-title-input';
  const descriptionInputId = 'task-description-input';
  const prioritySelectId = 'task-priority-select';
  const dueDateInputId = 'task-due-date-input';
  const tagsInputId = 'task-tags-input';

  // 当optimizedData改变时，重置编辑状态
  if (optimizedData && !editedData && !isEditMode) {
    setEditedData(optimizedData);
  }

  const displayData = editedData || optimizedData;

  const getPriorityLabel = (priority: Priority): string => {
    const labels: Record<Priority, string> = {
      low: '低',
      medium: '中',
      high: '高',
    };
    return labels[priority];
  };

  const getPriorityColor = (priority: Priority): string => {
    const colors: Record<Priority, string> = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[priority];
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('zh-CN');
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="md">
      <div className="p-6">
        {/* 标题 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">AI优化预览</h2>
          <p className="text-sm text-slate-600 mt-1">检查AI优化的任务内容</p>
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-slate-600">正在由AI优化...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm font-medium">优化失败</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* 优化结果预览 */}
        {displayData && !isLoading && !error && (
          <div className="space-y-4">
            {/* 标题 */}
            <div>
              <label
                htmlFor={titleInputId}
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                标题
              </label>
              {isEditMode ? (
                <input
                  id={titleInputId}
                  type="text"
                  value={editedData?.title || ''}
                  onChange={e =>
                    setEditedData(prev => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg">
                  {displayData.title}
                </p>
              )}
            </div>

            {/* 描述 */}
            {displayData.description && (
              <div>
                <label
                  htmlFor={descriptionInputId}
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  描述
                </label>
                {isEditMode ? (
                  <textarea
                    id={descriptionInputId}
                    value={editedData?.description || ''}
                    onChange={e =>
                      setEditedData(prev =>
                        prev ? { ...prev, description: e.target.value } : null,
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-slate-700 bg-slate-50 px-3 py-2 rounded-lg text-sm">
                    {displayData.description}
                  </p>
                )}
              </div>
            )}

            {/* 优先级、截止日期、标签 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 优先级 */}
              <div>
                <label
                  htmlFor={prioritySelectId}
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  优先级
                </label>
                {isEditMode ? (
                  <select
                    id={prioritySelectId}
                    value={editedData?.priority || 'medium'}
                    onChange={e =>
                      setEditedData(prev =>
                        prev ? { ...prev, priority: e.target.value as Priority } : null,
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                ) : (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                      displayData.priority,
                    )}`}
                  >
                    {getPriorityLabel(displayData.priority)}
                  </span>
                )}
              </div>

              {/* 截止日期 */}
              <div>
                <label
                  htmlFor={dueDateInputId}
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  截止日期
                </label>
                {isEditMode ? (
                  <input
                    id={dueDateInputId}
                    type="date"
                    value={
                      editedData?.dueDate
                        ? new Date(editedData.dueDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={e =>
                      setEditedData(prev =>
                        prev
                          ? {
                              ...prev,
                              dueDate: e.target.value ? new Date(e.target.value) : undefined,
                            }
                          : null,
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-slate-700 bg-slate-50 px-3 py-2 rounded-lg text-sm">
                    {formatDate(displayData.dueDate)}
                  </p>
                )}
              </div>
            </div>

            {/* 标签 */}
            {displayData.tags.length > 0 && (
              <div>
                <label
                  htmlFor={tagsInputId}
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  标签
                </label>
                {isEditMode ? (
                  <input
                    id={tagsInputId}
                    type="text"
                    value={editedData?.tags.join(', ') || ''}
                    onChange={e =>
                      setEditedData(prev =>
                        prev
                          ? {
                              ...prev,
                              tags: e.target.value.split(',').map(t => t.trim()),
                            }
                          : null,
                      )
                    }
                    placeholder="用逗号分隔"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {displayData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 推理说明 */}
            {displayData.reasoning && !isEditMode && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-600 mb-1">AI推理说明</p>
                <p className="text-xs text-slate-600">{displayData.reasoning}</p>
              </div>
            )}
          </div>
        )}

        {/* 按钮操作 */}
        {displayData && !isLoading && !error && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              取消
            </button>
            {!isEditMode ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="flex-1 px-4 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg font-medium transition-colors"
                >
                  编辑
                </button>
                <button
                  type="button"
                  onClick={() => onConfirm(displayData)}
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  确认
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  完成编辑
                </button>
                <button
                  type="button"
                  onClick={() => editedData && onConfirm(editedData)}
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  保存创建
                </button>
              </>
            )}
          </div>
        )}

        {/* 错误时的按钮 */}
        {error && !isLoading && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              关闭
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
