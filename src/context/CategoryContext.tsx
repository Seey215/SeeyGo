'use client';

import type React from 'react';
import { createContext, type ReactNode, useEffect, useReducer } from 'react';
import type { Category, CategoryAction } from '@/types';
import { DEFAULT_CATEGORIES } from '@/types/category';
import { STORAGE_KEYS, serializer, storage } from '@/utils/storage';
import { generateId } from '@/utils/taskUtils';

interface CategoryState {
  categories: Category[];
}

interface CategoryContextType {
  state: CategoryState;
  dispatch: React.Dispatch<CategoryAction>;
}

export const CategoryContext = createContext<CategoryContextType | null>(null);

// 分类状态初始值
const initialState: CategoryState = {
  categories: [],
};

// 分类状态 reducer
function categoryReducer(state: CategoryState, action: CategoryAction): CategoryState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };

    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category,
        ),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };

    default:
      return state;
  }
}

// 序列化分类数据
function serializeCategories(categories: Category[]): any[] {
  return categories.map(category =>
    serializer.serializeWithDates(category, ['createdAt', 'updatedAt']),
  );
}

// 反序列化分类数据
function deserializeCategories(data: any[]): Category[] {
  return data.map(category =>
    serializer.deserializeWithDates(category, ['createdAt', 'updatedAt']),
  );
}

// 创建默认分类
function createDefaultCategories(): Category[] {
  const now = new Date();
  return DEFAULT_CATEGORIES.map(category => ({
    ...category,
    id: generateId(),
    taskCount: 0,
    createdAt: now,
    updatedAt: now,
  }));
}

interface CategoryProviderProps {
  children: ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  // 从本地存储加载分类
  useEffect(() => {
    const storedCategories = storage.get(STORAGE_KEYS.CATEGORIES, []);
    if (storedCategories.length > 0) {
      const categories = deserializeCategories(storedCategories);
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } else {
      // 如果没有存储的分类，创建默认分类
      const defaultCategories = createDefaultCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: defaultCategories });
    }
  }, []);

  // 分类变化时保存到本地存储
  useEffect(() => {
    if (state.categories.length > 0) {
      const serializedCategories = serializeCategories(state.categories);
      storage.set(STORAGE_KEYS.CATEGORIES, serializedCategories);
    }
  }, [state.categories]);

  return (
    <CategoryContext.Provider value={{ state, dispatch }}>{children}</CategoryContext.Provider>
  );
}
