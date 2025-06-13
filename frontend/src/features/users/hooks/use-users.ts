import { useState, useCallback } from 'react';
import { useApi } from '@/lib/hooks/use-api';
import { usersService } from '../services/users.service';
import { 
  CreateUserRequestDto, 
  UpdateUserRequestDto, 
  UserFilters, 
  PaginationParams,
  UserStatus 
} from '@/lib/types/user';

// Hook for fetching users with filters and pagination
export function useUsers(
  filters: UserFilters = {}, 
  pagination: PaginationParams = { page: 0, size: 10, sortBy: 'id', sortDir: 'asc' }
) {
  return useApi(
    () => usersService.getAllUsers(filters, pagination),
    { immediate: true }
  );
}

// Hook for user CRUD operations
export function useUserOperations() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const createUser = useCallback(async (userData: CreateUserRequestDto) => {
    setIsCreating(true);
    try {
      const result = await usersService.createUser(userData);
      return result;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, userData: UpdateUserRequestDto) => {
    setIsUpdating(true);
    setUpdatingUserId(id);
    try {
      const result = await usersService.updateUser(id, userData);
      return result;
    } finally {
      setIsUpdating(false);
      setUpdatingUserId(null);
    }
  }, []);

  const updateUserStatus = useCallback(async (id: string, status: UserStatus) => {
    setIsUpdating(true);
    setUpdatingUserId(id);
    try {
      const result = await usersService.updateUserStatus(id, status);
      return result;
    } finally {
      setIsUpdating(false);
      setUpdatingUserId(null);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await usersService.deleteUser(id);
    } finally {
      setIsDeleting(false);
    }
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
  };
}

// Hook for user search and filtering
export function useUserFilters() {
  const [filters, setFilters] = useState<UserFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPagination({
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
  }, []);

  return {
    filters,
    pagination,
    updateFilters,
    updatePagination,
    resetFilters,
  };
}

// Hook for single user operations
export function useUser(id?: string) {
  return useApi(
    () => id ? usersService.getUserById(id) : Promise.resolve(null),
    { immediate: !!id }
  );
} 