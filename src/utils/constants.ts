/**
 * 应用常量定义
 */

// 应用配置
export const APP_CONFIG = {
  NAME: 'SeeyGo Todo',
  VERSION: '1.0.0',
  DESCRIPTION: '一个功能完整的待办事项管理应用',
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// UI 配置
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
  ANIMATION_DURATION: 200,
} as const;

// 优先级配置
export const PRIORITY_CONFIG = {
  low: {
    label: '低',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    value: 1,
  },
  medium: {
    label: '中',
    color: '#D97706',
    bgColor: '#FEF3C7',
    value: 2,
  },
  high: {
    label: '高',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    value: 3,
  },
} as const;

// 默认过滤器
export const DEFAULT_FILTERS = {
  search: '',
  priority: null,
  category: null,
  tags: [],
  dateRange: [undefined, undefined] as [Date?, Date?],
  status: 'all' as const,
};

// 默认排序
export const DEFAULT_SORT = {
  field: 'createdAt' as const,
  order: 'desc' as const,
};

// 默认UI状态
export const DEFAULT_UI_STATE = {
  currentView: 'all' as const,
  sidebarCollapsed: false,
  showCompleted: true,
  activeModal: null,
};

// 导航菜单配置
export const NAVIGATION_ITEMS = [
  {
    id: 'all',
    label: '所有任务',
    icon: 'list',
    path: '/',
    count: true,
  },
  {
    id: 'today',
    label: '今日任务',
    icon: 'calendar',
    path: '/today',
    count: true,
  },
  {
    id: 'important',
    label: '重要任务',
    icon: 'star',
    path: '/important',
    count: true,
  },
  {
    id: 'completed',
    label: '已完成',
    icon: 'check',
    path: '/completed',
    count: true,
  },
] as const;

// 主题色彩
export const THEME_COLORS = {
  primary: '#2563EB',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

// 快捷键配置
export const KEYBOARD_SHORTCUTS = {
  NEW_TASK: 'KeyN',
  SEARCH: 'KeyF',
  TOGGLE_SIDEBAR: 'KeyB',
  MARK_COMPLETE: 'Enter',
  DELETE_TASK: 'Delete',
} as const;

// 本地存储配置
export const STORAGE_CONFIG = {
  PREFIX: 'seeygo_todo_',
  KEYS: {
    TASKS: 'tasks',
    CATEGORIES: 'categories',
    TAGS: 'tags',
    SETTINGS: 'settings',
    UI_STATE: 'ui_state',
  },
  EXPIRY_DAYS: 365,
} as const;

// 表单验证配置
export const VALIDATION = {
  TASK_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  TASK_DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  CATEGORY_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  TAG_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 30,
  },
} as const;
