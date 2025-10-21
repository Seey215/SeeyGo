'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { SearchBar } from '@/components/ui';

/**
 * 顶部导航栏组件
 */
export function Navbar() {
  const pathname = usePathname();

  // 根据路径获取页面标题
  const getPageTitle = () => {
    if (pathname.startsWith('/view/')) {
      const type = pathname.split('/')[2];
      switch (type) {
        case 'all':
          return '所有任务';
        case 'today':
          return '今日任务';
        case 'important':
          return '重要任务';
        case 'completed':
          return '已完成';
        default:
          if (type?.startsWith('category-')) {
            return '分类任务';
          }
          return 'SeeyGo Todo';
      }
    }

    switch (pathname) {
      case '/settings':
        return '设置';
      default:
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
          {/* 预留空间，未来可以添加其他功能 */}
        </div>
      </div>
    </header>
  );
}
