'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SearchBar } from '@/components/filters';
import { FilterPanel } from '@/components/filters';
import { SortSelector } from '@/components/filters';

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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 左侧：页面标题 */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        {/* 中间：搜索栏 */}
        <div className="flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center space-x-3">
          {/* 排序选择器 */}
          <SortSelector />
          
          {/* 过滤按钮 */}
          <button 
            onClick={() => setShowFilterPanel(true)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="sr-only">过滤</span>
            ⚙️
          </button>
        </div>
      </div>
      
      {/* 过滤面板 */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
      />
    </header>
  );
}