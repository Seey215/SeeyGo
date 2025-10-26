'use client';

import { useCallback, useState } from 'react';
import { optimizeTask } from '@/ai/services/taskOptimizer';
import type { OptimizeTaskRequest, OptimizeTaskResult } from '@/ai/types';

export interface UseAIOptimizeTaskState {
  isLoading: boolean;
  error: string | null;
  result: OptimizeTaskResult | null;
}

export function useAIOptimizeTask() {
  const [state, setState] = useState<UseAIOptimizeTaskState>({
    isLoading: false,
    error: null,
    result: null,
  });

  /**
   * 优化任务输入
   */
  const optimize = useCallback(async (request: OptimizeTaskRequest) => {
    setState({ isLoading: true, error: null, result: null });

    try {
      const response = await optimizeTask(request);

      if (response.success && response.data) {
        setState({
          isLoading: false,
          error: null,
          result: response.data,
        });
        return response.data;
      } else {
        setState({
          isLoading: false,
          error: response.error || 'Unknown error',
          result: null,
        });
        throw new Error(response.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to optimize task';
      setState({
        isLoading: false,
        error: errorMessage,
        result: null,
      });
      throw error;
    }
  }, []);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    optimize,
    reset,
  };
}
