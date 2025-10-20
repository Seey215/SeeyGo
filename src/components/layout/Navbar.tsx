'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { FilterPanel, SearchBar, SortSelector } from '@/components/filters';

/**
 * 顶部导航栏组件
 */
export function Navbar() {
  const pathname = usePathname();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // 根据路径获取页面标题
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return '所有任务';
      case '/today':
        return '今日任务';
      case '/important':
        return '重要任务';
      case '/completed':
        return '已完成';
      case '/settings':
        return '设置';
      default:
        if (pathname.startsWith('/category/')) {
          return '分类任务';
        }
        return 'SeeyGo Todo';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* 左侧：页面标题 */}
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-slate-900 gradient-text">{getPageTitle()}</h1>
        </div>

        {/* 中间：搜索栏 */}
        <div className="flex-1 max-w-lg mx-8">
          <SearchBar />
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center space-x-3">
          {/* 排序选择器 */}
          <SortSelector />

          {/* 过滤按钮 */}
          <button
            type="button"
            onClick={() => setShowFilterPanel(true)}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 hover-scale"
          >
            <span className="sr-only">过滤</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>过滤</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 过滤面板 */}
      <FilterPanel isOpen={showFilterPanel} onClose={() => setShowFilterPanel(false)} />
    </header>
  );
}
