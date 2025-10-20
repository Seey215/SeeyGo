'use client';

import { Input } from '@/components/ui';
import { useFilters } from '@/hooks/useFilters';

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
        className="bg-white/80 backdrop-blur-sm border-slate-200/60 focus:bg-white focus:border-blue-400 focus:ring-blue-500/20"
      />
      {filters.search && (
        <button
          type="button"
          onClick={() => setSearch('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
