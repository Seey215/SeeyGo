import type { Category, Task, TaskFilters, TaskSort, UIState } from '@/types';

export interface AppStoreState {
  tasks: Task[];
  categories: Category[];
  filters: TaskFilters;
  sort: TaskSort;
  ui: UIState;
}
