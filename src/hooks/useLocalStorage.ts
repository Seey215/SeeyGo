import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/utils/storage';

/**
 * 本地存储 Hook
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 获取初始值
  const [value, setValue] = useState<T>(() => {
    return storage.get(key, initialValue);
  });

  // 更新存储值
  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prevValue => {
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prevValue)
        : newValue;
      
      storage.set(key, valueToStore);
      return valueToStore;
    });
  }, [key]);

  // 删除存储值
  const removeValue = useCallback(() => {
    storage.remove(key);
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setStoredValue, removeValue] as const;
}

/**
 * 异步本地存储 Hook
 */
export function useAsyncLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 加载存储值
  useEffect(() => {
    try {
      const storedValue = storage.get(key, initialValue);
      setValue(storedValue);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load from storage'));
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  // 更新存储值
  const setStoredValue = useCallback(async (newValue: T | ((prev: T) => T)) => {
    try {
      setValue(prevValue => {
        const valueToStore = typeof newValue === 'function' 
          ? (newValue as (prev: T) => T)(prevValue)
          : newValue;
        
        storage.set(key, valueToStore);
        return valueToStore;
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save to storage'));
    }
  }, [key]);

  // 删除存储值
  const removeValue = useCallback(async () => {
    try {
      storage.remove(key);
      setValue(initialValue);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove from storage'));
    }
  }, [key, initialValue]);

  return {
    value,
    setValue: setStoredValue,
    removeValue,
    loading,
    error,
  };
}