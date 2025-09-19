'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import { useTasks } from '@/hooks/useTasks';
import { TaskFormModal } from '@/components/tasks';
import { CategoryManager } from '@/components/categories';
import { getTaskStats, getTodayTasks, getImportantTasks } from '@/utils/taskUtils';
import { NAVIGATION_ITEMS } from '@/utils/constants';

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
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* 用户信息区域 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">U</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">用户</p>
            <p className="text-sm text-gray-500">欢迎回来</p>
          </div>
        </div>
      </div>

      {/* 快速操作区域 */}
      <div className="p-4 border-b border-gray-200">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + 新建任务
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4">
          <ul className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              const count = getNavItemCount(item.id);
              
              return (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 flex items-center justify-center">
                        {/* 这里可以添加图标 */}
                        {item.icon === 'list' && '📋'}
                        {item.icon === 'calendar' && '📅'}
                        {item.icon === 'star' && '⭐'}
                        {item.icon === 'check' && '✓'}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.count && count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
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
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">分类</h3>
              <button
                onClick={() => setShowCategoryManager(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                管理
              </button>
            </div>
            <ul className="space-y-1">
              {categories.map((category) => {
                const categoryPath = `/category/${category.id}`;
                const isActive = pathname === categoryPath;
                const count = getCategoryTaskCount(category.id);
                
                return (
                  <li key={category.id}>
                    <Link
                      href={categoryPath}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      {count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isActive
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
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

        {/* 标签云区域 */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-3">快速过滤</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              过期任务 ({getTaskStats(tasks).total > 0 ? '?' : '0'})
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              无分类任务
            </button>
          </div>
        </div>
      </nav>

      {/* 创建任务模态框 */}
      <TaskFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      
      {/* 分类管理模态框 */}
      <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
    </aside>
  );
}