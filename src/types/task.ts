export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  categoryId?: string;
  tags: string[];
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  categoryId?: string;
  tags: string[];
}

export interface TaskFilters {
  search: string;
  priority: Priority | null;
  category: string | null;
  tags: string[];
  dateRange: [Date?, Date?];
  status: TaskStatus | 'all';
}

export type SortField = 'title' | 'createdAt' | 'updatedAt' | 'dueDate' | 'priority';
export type SortOrder = 'asc' | 'desc';

export interface TaskSort {
  field: SortField;
  order: SortOrder;
}
