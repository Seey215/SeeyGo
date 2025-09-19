'use client';

import React from 'react';
import { Dropdown } from '@/components/ui';
import { useFilters } from '@/hooks/useFilters';
import type { SortField, SortOrder } from '@/types';

export function SortSelector() {
  const { sort, setSort } = useFilters();

  const sortOptions = [
    { value: 'createdAt-desc', label: '创建时间 ↓' },
    { value: 'createdAt-asc', label: '创建时间 ↑' },
    { value: 'updatedAt-desc', label: '更新时间 ↓' },
    { value: 'updatedAt-asc', label: '更新时间 ↑' },
    { value: 'title-asc', label: '标题 A-Z' },
    { value: 'title-desc', label: '标题 Z-A' },
    { value: 'priority-desc', label: '优先级 ↓' },
    { value: 'priority-asc', label: '优先级 ↑' },
    { value: 'dueDate-asc', label: '截止日期 ↑' },
    { value: 'dueDate-desc', label: '截止日期 ↓' },
  ];

  const currentSortValue = `${sort.field}-${sort.order}`;

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-') as [SortField, SortOrder];
    setSort({ field, order });
  };

  return (
    <Dropdown
      options={sortOptions}
      value={currentSortValue}
      onChange={handleSortChange}
      placeholder="选择排序方式"
    />
  );
}