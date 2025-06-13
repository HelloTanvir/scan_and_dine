'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { UsersTable } from '@/features/users/components/users-table';
import { UsersFilters } from '@/features/users/components/users-filters';
import { UserForm } from '@/features/users/components/user-form';
import { useUsers, useUserOperations, useUserFilters } from '@/features/users/hooks/use-users';
import { 
  UserResponseDto, 
  CreateUserRequestDto, 
  UpdateUserRequestDto,
  UserStatus 
} from '@/lib/types/user';

export default function UsersPage() {
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { filters, pagination, updateFilters, updatePagination, resetFilters } = useUserFilters();
  const { data, error, isLoading } = useUsers(filters, pagination);
  const { 
    createUser, 
    updateUser, 
    updateUserStatus, 
    deleteUser, 
    isCreating, 
    isUpdating, 
    isDeleting,
    updatingUserId 
  } = useUserOperations();

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: UserResponseDto) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleSubmitUser = async (userData: CreateUserRequestDto | UpdateUserRequestDto) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData as UpdateUserRequestDto);
      } else {
        await createUser(userData as CreateUserRequestDto);
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    try {
      await updateUserStatus(userId, status);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handlePageChange = (page: number) => {
    updatePagination({ page });
  };

  const handleRefresh = () => {
    updateFilters({});
  };

  return (
    <ProtectedRoute requiredRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-600 mt-1">
              Manage system users, roles, and permissions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleCreateUser}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{data.totalElements}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {data.content.filter(u => u.status === 'ACTIVE').length}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {data.content.filter(u => u.role === 'ADMIN').length}
              </div>
              <div className="text-sm text-gray-600">Admins</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">
                {data.content.filter(u => u.role === 'STAFF').length}
              </div>
              <div className="text-sm text-gray-600">Staff Members</div>
            </div>
          </div>
        )}

        <UsersFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">
              <strong>Error:</strong> Failed to load users. Please try again.
            </div>
          </div>
        )}

        {data && (
          <UsersTable
            data={data}
            isLoading={isLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onStatusChange={handleStatusChange}
            onPageChange={handlePageChange}
            isUpdating={isUpdating || isDeleting}
            updatingUserId={updatingUserId}
          />
        )}

        <UserForm
          user={editingUser || undefined}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitUser}
          isLoading={isCreating || isUpdating}
        />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 