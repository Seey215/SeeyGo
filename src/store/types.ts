import type { Category, Task, TaskFilters, UIState } from '@/types';

export interface AppStoreState {
  tasks: Task[];
  categories: Category[];
  filters: TaskFilters;
  ui: UIState;
}
