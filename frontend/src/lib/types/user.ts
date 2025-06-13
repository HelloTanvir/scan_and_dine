import { UserRole } from './auth';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequestDto {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface UpdateUserRequestDto {
  username?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserFilters {
  username?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface PaginationParams {
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
} 