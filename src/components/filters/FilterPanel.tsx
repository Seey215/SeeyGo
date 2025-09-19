'use client';

import React from 'react';
import { Button, Dropdown, DatePicker, Modal } from '@/components/ui';
import { useFilters } from '@/hooks/useFilters';
import { useCategories } from '@/hooks/useCategories';
import type { Priority, TaskStatus } from '@/types';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { filters, setPriorityFilter, setCategoryFilter, setStatusFilter, setDateFilter, clearFilters } = useFilters();
  const { categories } = useCategories();

  const priorityOptions = [
    { value: '', label: '所有优先级' },
    { value: 'high', label: '高优先级' },
    { value: 'medium', label: '中优先级' },
    { value: 'low', label: '低优先级' },
  ];

  const statusOptions = [
    { value: 'all', label: '所有状态' },
    { value: 'active', label: '进行中' },
    { value: 'completed', label: '已完成' },
  ];

  const categoryOptions = [
    { value: '', label: '所有分类' },
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="过滤条件" size="md">
      <div className="space-y-4">
        <Dropdown
          label="优先级"
          options={priorityOptions}
          value={filters.priority || ''}
          onChange={(value) => setPriorityFilter(value as Priority | null)}
          fullWidth
        />

        <Dropdown
          label="状态"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => setStatusFilter(value as TaskStatus | 'all')}
          fullWidth
        />

        <Dropdown
          label="分类"
          options={categoryOptions}
          value={filters.category || ''}
          onChange={(value) => setCategoryFilter(value || null)}
          fullWidth
        />

        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            label="开始日期"
            value={filters.dateRange[0]}
            onChange={(date) => setDateFilter([date, filters.dateRange[1]])}
            fullWidth
          />
          <DatePicker
            label="结束日期"
            value={filters.dateRange[1]}
            onChange={(date) => setDateFilter([filters.dateRange[0], date])}
            fullWidth
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={clearFilters}>
            清空过滤
          </Button>
          <Button onClick={onClose}>
            应用过滤
          </Button>
        </div>
      </div>
    </Modal>
  );
}