export interface Category {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  createdAt: Date;
  updatedAt: Date;
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
