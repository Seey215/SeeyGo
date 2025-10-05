'use client';

import React, { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { useCategories } from '@/hooks/useCategories';
import type { Category, CategoryFormData } from '@/types';

function CategoryForm({ category, onSubmit, onCancel, loading = false }: any) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    color: category?.color || '#2563EB',
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!formData.name.trim()) {
      newErrors.name = '分类名称不能为空';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const colorOptions = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="分类名称 *"
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="输入分类名称..."
        error={errors.name}
        fullWidth
        autoFocus
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">分类颜色</label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              className={`w-8 h-8 rounded-full border-2 ${
                formData.color === color ? 'border-gray-900' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          取消
        </Button>
        <Button type="submit" loading={loading}>
          {category ? '更新分类' : '创建分类'}
        </Button>
      </div>
    </form>
  );
}

export function CategoryManager({ isOpen, onClose }: any) {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory(data);
      }
      setShowForm(false);
      setEditingCategory(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="分类管理" size="lg">
      {showForm ? (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(undefined);
          }}
          loading={loading}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">管理你的任务分类</p>
            <Button size="sm" onClick={() => setShowForm(true)}>
              + 新建分类
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.taskCount} 个任务</p>
                  </div>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setShowForm(true);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('确定删除此分类吗？')) {
                        deleteCategory(category.id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
