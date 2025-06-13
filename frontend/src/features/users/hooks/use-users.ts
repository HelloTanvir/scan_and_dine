import { useState, useCallback, useEffect, useMemo } from 'react';
import { useApi } from '@/lib/hooks/use-api';
import { useDebounce } from '@/lib/utils/performance';
import { usersService } from '../services/users.service';
import { 
  CreateUserRequestDto, 
  UpdateUserRequestDto, 
  UserFilters, 
  PaginationParams,
  UserStatus 
} from '@/lib/types/user';

/**
 * User Management Hooks
 * 
 * Usage patterns:
 * 
 * 1. Separate hooks (current approach):
 *    const userFilters = useUserFilters();
 *    const userOperations = useUserOperations(userFilters.refreshData);
 * 
 * 2. Combined hook (simpler approach):
 *    const userManagement = useUserManagement();
 *    // Contains all filtering and operations in one hook
 * 
 * 3. Individual operations only:
 *    const userOperations = useUserOperations(); // Without auto-refresh
 */

// Hook for user CRUD operations
export function useUserOperations(onDataChange?: () => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (userData: CreateUserRequestDto) => {
    setIsCreating(true);
    setError(null);
    try {
      const result = await usersService.createUser(userData);
      onDataChange?.(); // Refresh data after successful creation
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsCreating(false);
    }
  }, [onDataChange]);

  const updateUser = useCallback(async (id: string, userData: UpdateUserRequestDto) => {
    setIsUpdating(true);
    setUpdatingUserId(id);
    setError(null);
    try {
      const result = await usersService.updateUser(id, userData);
      onDataChange?.(); // Refresh data after successful update
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsUpdating(false);
      setUpdatingUserId(null);
    }
  }, [onDataChange]);

  const updateUserStatus = useCallback(async (id: string, status: UserStatus) => {
    setIsUpdating(true);
    setUpdatingUserId(id);
    setError(null);
    try {
      const result = await usersService.updateUserStatus(id, status);
      onDataChange?.(); // Refresh data after successful status update
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user status';
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsUpdating(false);
      setUpdatingUserId(null);
    }
  }, [onDataChange]);

  const deleteUser = useCallback(async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      await usersService.deleteUser(id);
      onDataChange?.(); // Refresh data after successful deletion
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsDeleting(false);
    }
  }, [onDataChange]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
    updatingUserId,
    error,
    clearError,
  };
}

// Hook for user search and filtering with debounce
export function useUserFilters() {
  const [uiFilters, setUiFilters] = useState<UserFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<UserFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 10,
    sortBy: 'created_at',
    sortDir: 'desc',
  });

  // Use the users hook with debounced filters and pagination
  const { data, error, isLoading, execute } = useApi(
    () => usersService.getAllUsers(debouncedFilters, pagination),
    { immediate: true }
  );

  // Debounce the filter updates - this will update debouncedFilters after 300ms
  const debouncedSetFilters = useDebounce((newFilters: unknown) => {
    setDebouncedFilters(newFilters as UserFilters);
  }, 300);

  // Update filters immediately for UI, but debounce for API calls
  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    const updatedFilters = { ...uiFilters, ...newFilters };
    
    // Update UI immediately
    setUiFilters(updatedFilters);
    
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 0 }));
    
    // Debounce the API call by updating debouncedFilters after 300ms
    debouncedSetFilters(updatedFilters);
  }, [uiFilters, debouncedSetFilters]);

  // Create stable dependencies for useEffect
  const debouncedFiltersString = useMemo(() => JSON.stringify(debouncedFilters), [debouncedFilters]);
  const paginationString = useMemo(() => JSON.stringify(pagination), [pagination]);

  // Execute API call when debouncedFilters or pagination changes
  useEffect(() => {
    execute();
  }, [execute, debouncedFiltersString, paginationString]);

  const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const resetFilters = useCallback(() => {
    const emptyFilters = {};
    setUiFilters(emptyFilters);
    setDebouncedFilters(emptyFilters);
    setPagination({
      page: 0,
      size: 10,
      sortBy: 'created_at',
      sortDir: 'desc',
    });
  }, []);

  // Refresh function to manually trigger data refetch
  const refreshData = useCallback(() => {
    execute();
  }, [execute]);

  return {
    filters: uiFilters, // Return UI filters for immediate display
    pagination,
    data,
    error,
    isLoading,
    updateFilters,
    updatePagination,
    resetFilters,
    refreshData, // Export refresh function
  };
}

// Hook for single user operations
export function useUser(id?: string) {
  return useApi(
    () => id ? usersService.getUserById(id) : Promise.resolve(null),
    { immediate: !!id }
  );
}

// Combined hook for integrated user management
export function useUserManagement() {
  const filterHook = useUserFilters();
  const operationsHook = useUserOperations(filterHook.refreshData);

  return {
    // Filters and data
    ...filterHook,
    // Operations
    ...operationsHook,
  };
} 