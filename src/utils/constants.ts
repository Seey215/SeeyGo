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

// 优先级配置 - Stripe风格
export const PRIORITY_CONFIG = {
  low: {
    label: '低',
    color: '#64748B',
    bgColor: '#F1F5F9',
    gradient: 'from-slate-100 to-slate-200',
    value: 1,
  },
  medium: {
    label: '中',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    gradient: 'from-amber-100 to-amber-200',
    value: 2,
  },
  high: {
    label: '高',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    gradient: 'from-red-100 to-red-200',
    value: 3,
  },
} as const;

// 默认过滤器
export const DEFAULT_FILTERS = {
  search: '',
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
    path: '/view/all',
    count: true,
  },
  {
    id: 'today',
    label: '今日任务',
    icon: 'calendar',
    path: '/view/today',
    count: true,
  },
  {
    id: 'important',
    label: '重要任务',
    icon: 'star',
    path: '/view/important',
    count: true,
  },
  {
    id: 'completed',
    label: '已完成',
    icon: 'check',
    path: '/view/completed',
    count: true,
  },
] as const;

// 主题色彩 - Stripe风格精致配色
export const THEME_COLORS = {
  primary: '#3B82F6', // 精致蓝色
  primaryDark: '#1D4ED8', // 深蓝色
  secondary: '#0EA5E9', // 天空蓝
  success: '#10B981', // 翠绿
  warning: '#F59E0B', // 琥珀
  danger: '#EF4444', // 珊瑚红
  gray: {
    25: '#FAFBFC', // 超浅灰背景
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  // 渐变色彩
  gradients: {
    primary: 'from-blue-500 to-blue-600',
    primaryHover: 'from-blue-600 to-blue-700',
    secondary: 'from-sky-400 to-sky-500',
    success: 'from-emerald-500 to-emerald-600',
    warning: 'from-amber-500 to-amber-600',
    danger: 'from-red-500 to-red-600',
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
