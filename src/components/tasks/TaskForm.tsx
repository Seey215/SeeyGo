'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Dropdown, DatePicker } from '@/components/ui';
import { useCategories } from '@/hooks/useCategories';
import type { Task, TaskFormData, Priority } from '@/types';
import { PRIORITY_CONFIG } from '@/utils/constants';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const priorityOptions = Object.entries(PRIORITY_CONFIG).map(([key, config]) => ({
  value: key,
  label: config.label,
}));

export function TaskForm({ task, onSubmit, onCancel, loading = false }: TaskFormProps) {
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate,
    categoryId: task?.categoryId || '',
    tags: task?.tags || [],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 任务标题 */}
      <Input
        label="任务标题 *"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        placeholder="输入任务标题..."
        error={errors.title}
        fullWidth
        autoFocus
      />
      
      {/* 任务描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          任务描述
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="输入任务描述..."
          rows={3}
          className={`block w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      
      {/* 优先级和分类 */}
      <div className="grid grid-cols-2 gap-4">
        <Dropdown
          label="优先级"
          options={priorityOptions}
          value={formData.priority}
          onChange={(value) => setFormData(prev => ({ ...prev, priority: value as Priority }))}
          fullWidth
        />
        
        <Dropdown
          label="分类"
          options={categoryOptions}
          value={formData.categoryId}
          onChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
          fullWidth
        />
      </div>
      
      {/* 截止日期 */}
      <DatePicker
        label="截止日期"
        value={formData.dueDate}
        onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
        fullWidth
        minDate={new Date()}
      />
      
      {/* 标签输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标签
        </label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="输入标签后按回车添加..."
              fullWidth
            />
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              disabled={!tagInput.trim()}
            >
              添加
            </Button>
          </div>
          
          {/* 标签列表 */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
                  >
                    <span className="sr-only">删除标签</span>
                    <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
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
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          取消
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {task ? '更新任务' : '创建任务'}
        </Button>
      </div>
    </form>
  );
}