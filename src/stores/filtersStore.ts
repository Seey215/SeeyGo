/**
 * UI Store - 使用 Zustand 管理 UI 状态
 * 包括侧边栏、选中任务、加载状态等
 */

import { create } from 'zustand';
import type { UIState } from '@/lib/types';

interface UIStoreState extends UIState {
  // 行为
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSelectedTaskId: (id: string | undefined) => void;
  setEditingTaskId: (id: string | undefined) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
  showToast: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    duration?: number,
  ) => void;
  closeToast: () => void;
}

const defaultUIState: UIState = {
  sidebarOpen: true,
  selectedTaskId: undefined,
  editingTaskId: undefined,
  isLoading: false,
  error: undefined,
  toast: undefined,
};

let toastTimeoutId: NodeJS.Timeout | null = null;

export const useUIStore = create<UIStoreState>(set => ({
  ...defaultUIState,

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  toggleSidebar: () => {
    set((state: UIStoreState) => ({
      sidebarOpen: !state.sidebarOpen,
    }));
  },

  setSelectedTaskId: (id: string | undefined) => {
    set({ selectedTaskId: id });
  },

  setEditingTaskId: (id: string | undefined) => {
    set({ editingTaskId: id });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | undefined) => {
    set({ error });
  },

  showToast: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    duration: number = 3000,
  ) => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }

    set({
      toast: {
        id: `${Date.now()}`,
        message,
        type,
        duration,
      },
    });

    toastTimeoutId = setTimeout(() => {
      set({ toast: undefined });
      toastTimeoutId = null;
    }, duration);
  },

  closeToast: () => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
      toastTimeoutId = null;
    }
    set({ toast: undefined });
  },
}));
