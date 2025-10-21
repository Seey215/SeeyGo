import { useCallback, useContext, useEffect, useState } from 'react';
import type {
  Category,
  CategoryFormData,
  Priority,
  SortField,
  SortOrder,
  Task,
  TaskFormData,
  TaskSort,
  TaskStatus,
} from '@/types';
import { createTask, generateId, updateTask } from '@/utils/taskUtils';
import { AppStoreContext } from './store';

/**
 * 任务管理 Hook
 */
export function useTasks() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useTasks must be used within an AppStoreProvider');
  }

  const { state, dispatch } = context;

  // 创建任务
  const createNewTask = useCallback(
    (data: TaskFormData) => {
      const task = createTask(data);
      dispatch({ type: 'ADD_TASK', payload: task });
      return task;
    },
    [dispatch],
  );

  // 更新任务
  const updateExistingTask = useCallback(
    (taskId: string, updates: Partial<TaskFormData>) => {
      const existingTask = state.tasks.find(task => task.id === taskId);
      if (!existingTask) return null;

      const updatedTask = updateTask(existingTask, updates);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return updatedTask;
    },
    [state.tasks, dispatch],
  );

  // 删除任务
  const deleteTask = useCallback(
    (taskId: string) => {
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    },
    [dispatch],
  );

  // 切换任务完成状态
  const toggleComplete = useCallback(
    (taskId: string) => {
      dispatch({ type: 'TOGGLE_TASK', payload: taskId });
    },
    [dispatch],
  );

  // 批量操作
  const batchDelete = useCallback(
    (taskIds: string[]) => {
      taskIds.forEach(id => {
        dispatch({ type: 'DELETE_TASK', payload: id });
      });
    },
    [dispatch],
  );

  const batchToggleComplete = useCallback(
    (taskIds: string[]) => {
      taskIds.forEach(id => {
        dispatch({ type: 'TOGGLE_TASK', payload: id });
      });
    },
    [dispatch],
  );

  // 根据ID获取任务
  const getTaskById = useCallback(
    (taskId: string): Task | undefined => {
      return state.tasks.find(task => task.id === taskId);
    },
    [state.tasks],
  );

  return {
    tasks: state.tasks,
    createTask: createNewTask,
    updateTask: updateExistingTask,
    deleteTask,
    toggleComplete,
    batchDelete,
    batchToggleComplete,
    getTaskById,
  };
}

/**
 * 分类管理 Hook
 */
export function useCategories() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useCategories must be used within an AppStoreProvider');
  }

  const { state, dispatch } = context;

  // 创建分类
  const createCategory = useCallback(
    (data: CategoryFormData) => {
      const now = new Date();
      const category: Category = {
        id: generateId(),
        name: data.name,
        color: data.color,
        taskCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_CATEGORY', payload: category });
      return category;
    },
    [dispatch],
  );

  // 更新分类
  const updateCategory = useCallback(
    (categoryId: string, updates: Partial<CategoryFormData>) => {
      const existingCategory = state.categories.find(cat => cat.id === categoryId);
      if (!existingCategory) return null;

      const updatedCategory: Category = {
        ...existingCategory,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
      return updatedCategory;
    },
    [state.categories, dispatch],
  );

  // 删除分类
  const deleteCategory = useCallback(
    (categoryId: string) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    },
    [dispatch],
  );

  // 根据ID获取分类
  const getCategoryById = useCallback(
    (categoryId: string): Category | undefined => {
      return state.categories.find(category => category.id === categoryId);
    },
    [state.categories],
  );

  // 获取分类名称
  const getCategoryName = useCallback(
    (categoryId?: string): string => {
      if (!categoryId) return '未分类';
      const category = getCategoryById(categoryId);
      return category?.name || '未知分类';
    },
    [getCategoryById],
  );

  return {
    categories: state.categories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryName,
  };
}

/**
 * 过滤器和排序管理 Hook
 */
export function useFilters() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useFilters must be used within an AppStoreProvider');
  }

  const { state, dispatch } = context;

  // 设置搜索
  const setSearch = useCallback(
    (search: string) => {
      dispatch({ type: 'SET_SEARCH', payload: search });
    },
    [dispatch],
  );

  // 设置优先级过滤
  const setPriorityFilter = useCallback(
    (priority: Priority | null) => {
      dispatch({ type: 'SET_PRIORITY_FILTER', payload: priority });
    },
    [dispatch],
  );

  // 设置分类过滤
  const setCategoryFilter = useCallback(
    (category: string | null) => {
      dispatch({ type: 'SET_CATEGORY_FILTER', payload: category });
    },
    [dispatch],
  );

  // 设置标签过滤
  const setTagFilter = useCallback(
    (tags: string[]) => {
      dispatch({ type: 'SET_TAG_FILTER', payload: tags });
    },
    [dispatch],
  );

  // 设置日期过滤
  const setDateFilter = useCallback(
    (dateRange: [Date?, Date?]) => {
      dispatch({ type: 'SET_DATE_FILTER', payload: dateRange });
    },
    [dispatch],
  );

  // 设置状态过滤
  const setStatusFilter = useCallback(
    (status: TaskStatus | 'all') => {
      dispatch({ type: 'SET_STATUS_FILTER', payload: status });
    },
    [dispatch],
  );

  // 清空过滤器
  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, [dispatch]);

  // 设置排序
  const setSort = useCallback(
    (sort: TaskSort) => {
      dispatch({ type: 'SET_SORT', payload: sort });
    },
    [dispatch],
  );

  return {
    filters: state.filters,
    sort: state.sort,
    setSearch,
    setPriorityFilter,
    setCategoryFilter,
    setTagFilter,
    setDateFilter,
    setStatusFilter,
    clearFilters,
    setSort,
  };
}

/**
 * 本地存储 Hook (保留原有的功能)
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}

/**
 * 异步本地存储 Hook (保留原有的功能)
 */
export function useAsyncLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue, isLoading] as const;
}
