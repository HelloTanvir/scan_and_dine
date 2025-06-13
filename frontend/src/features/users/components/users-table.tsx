'use client';

import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Shield, ShieldOff } from 'lucide-react';
import { UserResponseDto, PaginatedResponse, UserStatus } from '@/lib/types/user';
import { UserStatusBadge } from './user-status-badge';
import { UserRoleBadge } from './user-role-badge';

interface UsersTableProps {
  data: PaginatedResponse<UserResponseDto>;
  isLoading?: boolean;
  onEdit: (user: UserResponseDto) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
  onPageChange: (page: number) => void;
  isUpdating?: boolean;
  updatingUserId?: string | null;
}

export function UsersTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onPageChange,
  isUpdating,
  updatingUserId
}: UsersTableProps) {
  const handleDelete = (user: UserResponseDto) => {
    if (window.confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
      onDelete(user.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusToggleAction = (user: UserResponseDto) => {
    switch (user.status) {
      case 'ACTIVE':
        return { status: 'INACTIVE' as UserStatus, label: 'Deactivate', icon: ShieldOff };
      case 'INACTIVE':
        return { status: 'ACTIVE' as UserStatus, label: 'Activate', icon: Shield };
      case 'SUSPENDED':
        return { status: 'ACTIVE' as UserStatus, label: 'Activate', icon: Shield };
      default:
        return { status: 'ACTIVE' as UserStatus, label: 'Activate', icon: Shield };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.content.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.username}</div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber || '-'}</TableCell>
                <TableCell>
                  <UserRoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  <UserStatusBadge status={user.status} />
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        disabled={isUpdating && updatingUserId === user.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onStatusChange(user.id, getStatusToggleAction(user).status)}
                      >
                        {(() => {
                          const action = getStatusToggleAction(user);
                          const Icon = action.icon;
                          return (
                            <>
                              <Icon className="mr-2 h-4 w-4" />
                              {action.label}
                            </>
                          );
                        })()}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(user)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {data.numberOfElements} of {data.totalElements} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.number - 1)}
            disabled={data.first}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(data.totalPages - 5, data.number - 2)) + i;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === data.number ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.number + 1)}
            disabled={data.last}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
} 