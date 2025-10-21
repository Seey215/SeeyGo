'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CategoryManager } from '@/components/categories/CategoryManager';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { SearchBar } from '@/components/ui';
import { useCategories, useTasks } from '@/hooks';
import { NAVIGATION_ITEMS } from '@/utils/constants';
import { getImportantTasks, getTaskStats, getTodayTasks } from '@/utils/taskUtils';

/**
 * 侧边栏导航组件
 */
export function Sidebar() {
  const pathname = usePathname();
  const { categories } = useCategories();
  const { tasks } = useTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // 计算任务统计
  const taskStats = getTaskStats(tasks);
  const todayTasks = getTodayTasks(tasks);
  const importantTasks = getImportantTasks(tasks);

  // 获取导航项的任务数量
  const getNavItemCount = (itemId: string) => {
    switch (itemId) {
      case 'all':
        return taskStats.active;
      case 'today':
        return todayTasks.filter(task => !task.completed).length;
      case 'important':
        return importantTasks.filter(task => !task.completed).length;
      case 'completed':
        return taskStats.completed;
      default:
        return 0;
    }
  };

  // 获取分类的任务数量
  const getCategoryTaskCount = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId && !task.completed).length;
  };

  return (
    <aside className="w-80 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200/60 flex flex-col h-full shadow-sm">
      {/* 用户信息区域 */}
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg">用户</p>
            <p className="text-sm text-slate-500">欢迎回来</p>
          </div>
        </div>
      </div>

      {/* 搜索区域 */}
      <div className="p-4 border-b border-slate-200/60">
        <SearchBar />
      </div>

      {/* 快速操作区域 */}
      <div className="p-4 border-b border-slate-200/60">
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="w-full btn-gradient text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg"
        >
          <svg
            className="w-4 h-4 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>添加图标</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建任务
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4">
          <ul className="space-y-1">
            {NAVIGATION_ITEMS.map(item => {
              const isActive = pathname === item.path;
              const count = getNavItemCount(item.id);

              return (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 hover-scale ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 flex items-center justify-center">
                        {item.icon === 'list' && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <title>列表图标</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        )}
                        {item.icon === 'calendar' && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <title>日历图标</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                        {item.icon === 'star' && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <title>星形图标</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        )}
                        {item.icon === 'check' && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <title>完成图标</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.count && count > 0 && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 分类列表 */}
        {categories.length > 0 && (
          <div className="p-4 border-t border-slate-200/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">分类</h3>
              <button
                type="button"
                onClick={() => setShowCategoryManager(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200"
              >
                管理
              </button>
            </div>
            <ul className="space-y-1">
              {categories.map(category => {
                const categoryPath = `/view/category-${category.id}`;
                const isActive = pathname === categoryPath;
                const count = getCategoryTaskCount(category.id);

                return (
                  <li key={category.id}>
                    <Link
                      href={categoryPath}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 hover-scale ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      {count > 0 && (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* 创建任务模态框 */}
      <TaskFormModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* 分类管理模态框 */}
      <CategoryManager isOpen={showCategoryManager} onClose={() => setShowCategoryManager(false)} />
    </aside>
  );
}
