import type { Task, TaskAction } from '@/types';
import { toggleTaskComplete } from '@/utils/taskUtils';
import type { AppStoreState } from './types';

/**
 * 任务相关 reducer
 */
export function taskReducer(state: AppStoreState, action: TaskAction): AppStoreState {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task: Task) =>
          task.id === action.payload.id ? action.payload : task,
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task: Task) => task.id !== action.payload),
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task: Task) =>
          task.id === action.payload ? toggleTaskComplete(task) : task,
        ),
      };

    default:
      return state;
  }
}
