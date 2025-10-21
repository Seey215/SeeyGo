'use client';

import { useFilters } from '@/hooks';
import { Input } from './Input';

export function SearchBar() {
  const { filters, setSearch } = useFilters();

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="搜索任务..."
        value={filters.search}
        onChange={e => setSearch(e.target.value)}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>搜索图标</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        fullWidth
        className="bg-slate-100/50 border-0 border-b border-slate-200/60 hover:border-slate-300 hover:bg-slate-100 hover:shadow-sm focus:border-slate-400 focus:bg-white focus:shadow-md focus:outline-none focus:ring-0 transition-all duration-200 rounded-lg"
      />
      {filters.search && (
        <button
          type="button"
          onClick={() => setSearch('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition-all duration-200 hover-scale"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>清除搜索</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
