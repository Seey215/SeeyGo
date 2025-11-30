'use client';

import type React from 'react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, DatePicker, Dropdown, Input } from '@/components/ui';
import { useCategories } from '@/hooks';
import type { Priority, Task, TaskFormData } from '@/types';
import { PRIORITY_CONFIG } from '@/utils/constants';

export interface TaskFormRef {
  getCurrentFormData: () => TaskFormData;
}

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
  defaultCategoryId?: string;
  defaultViewType?: string;
}

const priorityOptions = Object.entries(PRIORITY_CONFIG).map(([key, config]) => ({
  value: key,
  label: config.label,
}));

export const TaskForm = forwardRef<TaskFormRef, TaskFormProps>(function TaskForm(
  { task, onSubmit, loading = false, defaultCategoryId, defaultViewType },
  ref,
) {
  const { categories } = useCategories();

  // 根据视图类型获取默认值
  const getDefaultValues = (): { dueDate?: string; priority?: Priority } => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // 设置为今天的结束时间

    switch (defaultViewType) {
      case 'today':
        return {
          dueDate: today.toISOString(),
          priority: 'medium' as Priority, // 今日任务默认为中优先级
        };
      case 'important':
        return {
          priority: 'high' as Priority, // 重要任务保持高优先级
        };
      default:
        return {
          priority: 'medium' as Priority, // 其他情况默认为中优先级
        };
    }
  };

  const defaultValues = getDefaultValues();

  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || defaultValues.priority || 'medium',
    dueDate: task?.dueDate || defaultValues.dueDate,
    categoryId: task?.categoryId || defaultCategoryId || '',
    tags: task?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  // 暴露获取当前表单数据的方法给父组件
  useImperativeHandle(ref, () => ({
    getCurrentFormData: () => formData,
  }));

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = '任务标题不能为空';
    } else if (formData.title.length > 200) {
      newErrors.title = '任务标题不能超过200个字符';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = '任务描述不能超过1000个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        categoryId: formData.categoryId || undefined,
      });
    }
  };

  // 处理标签输入
  const handleTagInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // 分类选项
  const categoryOptions = [
    { value: '', label: '无分类' },
    ...categories.map(category => ({
      value: category.id,
      label: category.name,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 任务标题 */}
      <Input
        label="任务标题 *"
        value={formData.title}
        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
        placeholder="输入任务标题..."
        error={errors.title}
        fullWidth
        autoFocus
      />

      {/* 任务描述 */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
          任务描述
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="输入任务描述..."
          rows={4}
          className={`block w-full px-4 py-3 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 bg-white shadow-sm ${
            errors.description
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-blue-500 hover:border-slate-400'
          }`}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>
        )}
      </div>

      {/* 优先级和分类 */}
      <div className="grid grid-cols-2 gap-6">
        <Dropdown
          label="优先级"
          options={priorityOptions}
          value={formData.priority}
          onChange={value => setFormData(prev => ({ ...prev, priority: value as Priority }))}
          fullWidth
        />

        <Dropdown
          label="分类"
          options={categoryOptions}
          value={formData.categoryId}
          onChange={value => setFormData(prev => ({ ...prev, categoryId: value }))}
          fullWidth
        />
      </div>

      {/* 截止日期 */}
      <DatePicker
        label="截止日期"
        value={formData.dueDate ? new Date(formData.dueDate) : undefined}
        onChange={date => setFormData(prev => ({ ...prev, dueDate: date?.toISOString() }))}
        fullWidth
        minDate={new Date()}
      />

      {/* 标签输入 */}
      <div>
        <label htmlFor="tagInput" className="block text-sm font-semibold text-slate-700 mb-2">
          标签
        </label>
        <div className="space-y-3">
          <div className="flex space-x-3">
            <Input
              id="tagInput"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="输入标签后按回车添加..."
              fullWidth
            />
            <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
              添加
            </Button>
          </div>

          {/* 标签列表 */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-300 hover:text-blue-700 focus:outline-none focus:bg-blue-300 focus:text-blue-700 transition-all duration-200"
                  >
                    <span className="sr-only">删除标签</span>
                    <svg
                      className="w-2.5 h-2.5"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                      role="img"
                      aria-label="删除标签"
                    >
                      <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
        <Button type="submit" loading={loading}>
          {task ? '更新任务' : '创建任务'}
        </Button>
      </div>
    </form>
  );
});
