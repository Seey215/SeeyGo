'use client';

import React from 'react';
import { Input } from '@/components/ui';
import { useFilters } from '@/hooks/useFilters';

export function SearchBar() {
  const { filters, setSearch } = useFilters();

  return (
    <Input
      type="text"
      placeholder="搜索任务..."
      value={filters.search}
      onChange={e => setSearch(e.target.value)}
      leftIcon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      fullWidth
    />
  );
}
