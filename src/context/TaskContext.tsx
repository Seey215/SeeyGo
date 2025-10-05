'use client';

import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import type { Task, TaskAction } from '@/types';
import { STORAGE_KEYS, storage, serializer } from '@/utils/storage';
import { toggleTaskComplete } from '@/utils/taskUtils';

interface TaskState {
  tasks: Task[];
}

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

export const TaskContext = createContext<TaskContextType | null>(null);

// 任务状态初始值
const initialState: TaskState = {
  tasks: [],
};

// 任务状态 reducer
function taskReducer(state: TaskState, action: TaskAction): TaskState {
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
        tasks: state.tasks.map(task => (task.id === action.payload.id ? action.payload : task)),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? toggleTaskComplete(task) : task,
        ),
      };

    default:
      return state;
  }
}

// 序列化任务数据
function serializeTasks(tasks: Task[]): any[] {
  return tasks.map(task =>
    serializer.serializeWithDates(task, ['createdAt', 'updatedAt', 'dueDate']),
  );
}

// 反序列化任务数据
function deserializeTasks(data: any[]): Task[] {
  return data.map(task =>
    serializer.deserializeWithDates(task, ['createdAt', 'updatedAt', 'dueDate']),
  );
}

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // 从本地存储加载任务
  useEffect(() => {
    const storedTasks = storage.get(STORAGE_KEYS.TASKS, []);
    if (storedTasks.length > 0) {
      const tasks = deserializeTasks(storedTasks);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    }
  }, []);

  // 任务变化时保存到本地存储
  useEffect(() => {
    if (state.tasks.length > 0) {
      const serializedTasks = serializeTasks(state.tasks);
      storage.set(STORAGE_KEYS.TASKS, serializedTasks);
    }
  }, [state.tasks]);

  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>;
}
