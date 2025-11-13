/**
 * 业务域的核心类型定义
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  aiSuggestion?: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Filter {
  categoryId?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  searchQuery?: string;
}

export interface UIState {
  sidebarOpen: boolean;
  selectedTaskId?: string;
  editingTaskId?: string;
  isLoading: boolean;
  error?: string;
  toast?: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  };
}

/**
 * API 响应的通用格式
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

/**
 * 分页信息
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}
