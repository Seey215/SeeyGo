/**
 * 本地存储工具函数
 */

// 存储键名常量
export const STORAGE_KEYS = {
  TASKS: 'todolist_tasks',
  CATEGORIES: 'todolist_categories',
  TAGS: 'todolist_tags',
  SETTINGS: 'todolist_settings',
  UI_STATE: 'todolist_ui_state',
} as const;

/**
 * 安全的 localStorage 操作
 */
export const storage = {
  /**
   * 获取存储的数据
   */
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error getting item from localStorage:`, error);
      return defaultValue;
    }
  },

  /**
   * 设置存储的数据
   */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item to localStorage:`, error);
    }
  },

  /**
   * 删除存储的数据
   */
  remove(key: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage:`, error);
    }
  },

  /**
   * 清空所有相关存储
   */
  clear(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  },
};

/**
 * 数据序列化/反序列化工具
 */
export const serializer = {
  /**
   * 序列化日期对象
   */
  serializeDate(date: Date): string {
    return date.toISOString();
  },

  /**
   * 反序列化日期对象
   */
  deserializeDate(dateString: string): Date {
    return new Date(dateString);
  },

  /**
   * 序列化带日期的对象
   */
  serializeWithDates<T extends Record<string, any>>(obj: T, dateFields: (keyof T)[]): any {
    const serialized: any = { ...obj };
    dateFields.forEach(field => {
      const value = serialized[field];
      if (value && value instanceof Date) {
        serialized[field] = this.serializeDate(value);
      }
    });
    return serialized;
  },

  /**
   * 反序列化带日期的对象
   */
  deserializeWithDates<T extends Record<string, any>>(obj: any, dateFields: (keyof T)[]): T {
    const deserialized = { ...obj };
    dateFields.forEach(field => {
      if (typeof deserialized[field] === 'string') {
        deserialized[field] = this.deserializeDate(deserialized[field]);
      }
    });
    return deserialized;
  },
};