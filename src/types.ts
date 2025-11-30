// ================================
// 任务相关类型
// ================================

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // ISO 日期字符串，便于序列化存储
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
  tags: string[];
  aiSuggestion?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  categoryId?: string;
  tags: string[];
}

// ================================
// 筛选器相关类型
// ================================

export interface Filter {
  categoryId?: string;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  searchQuery?: string;
}

// 兼容旧的 TaskFilters 接口
export interface TaskFilters {
  search: string;
}

// ================================
// 分类相关类型
// ================================

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'taskCount' | 'createdAt' | 'updatedAt'>[] =
  [
    { name: '个人', color: '#2563EB' },
    { name: '工作', color: '#059669' },
    { name: '学习', color: '#D97706' },
    { name: '生活', color: '#DC2626' },
  ];

// ================================
// 标签相关类型
// ================================

export interface Tag {
  id: string;
  name: string;
  usageCount: number;
  createdAt: string;
}

export interface TagFormData {
  name: string;
}

// ================================
// UI 和应用状态类型
// ================================

export type ViewType = 'all' | 'today' | 'important' | 'completed' | 'category';

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
  // 兼容旧的 UI 状态
  currentView?: ViewType;
  sidebarCollapsed?: boolean;
  showCompleted?: boolean;
  activeModal?: string | null;
}

export interface AppState {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  filters: TaskFilters;
  ui: UIState;
}

// ================================
// Redux/Action 类型
// ================================

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] };

export type CategoryAction =
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] };

export type TagAction =
  | { type: 'ADD_TAG'; payload: Tag }
  | { type: 'UPDATE_TAG'; payload: Tag }
  | { type: 'DELETE_TAG'; payload: string }
  | { type: 'SET_TAGS'; payload: Tag[] };

export type FilterAction = { type: 'SET_SEARCH'; payload: string };

export type UIAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SHOW_COMPLETED'; payload: boolean }
  | { type: 'SET_ACTIVE_MODAL'; payload: string | null };

// ================================
// API 响应类型
// ================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}
