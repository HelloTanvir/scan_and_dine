import { useState, useEffect, useCallback, useRef } from 'react';
import { AppError, LoadingState } from '@/lib/types';

interface UseApiOptions<T> {
  initialData?: T;
  immediate?: boolean;
}

interface UseApiReturn<T> extends LoadingState {
  data: T | null;
  execute: (...args: unknown[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { initialData = null, immediate = false } = options;
  
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState<AppError | null>(null);
  
  // Use ref to store the function to avoid dependency issues
  const apiFunctionRef = useRef(apiFunction);
  apiFunctionRef.current = apiFunction;

  const execute = useCallback(
    async (...args: unknown[]): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await apiFunctionRef.current(...args);
        setData(result);
        return result;
      } catch (err) {
        const appError: AppError = {
          message: err instanceof Error ? err.message : 'An unknown error occurred',
          details: err,
        };
        setError(appError);
        throw appError;
      } finally {
        setIsLoading(false);
      }
    },
    [] // Remove apiFunction from dependencies
  );

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
  }, [initialData]);

  // Use ref to track if initial execution has happened
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (immediate && !hasExecutedRef.current) {
      hasExecutedRef.current = true;
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
} 