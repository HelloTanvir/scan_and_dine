import { apiClient } from '@/lib/api/client';
import { 
  UserResponseDto, 
  CreateUserRequestDto, 
  UpdateUserRequestDto, 
  UserFilters, 
  PaginationParams, 
  PaginatedResponse,
  UserStatus 
} from '@/lib/types/user';
import { API_ENDPOINTS } from '@/lib/constants';

export class UsersService {
  private readonly baseUrl = API_ENDPOINTS.USERS;

  // Get all users with filtering and pagination
  async getAllUsers(
    filters: UserFilters = {}, 
    pagination: PaginationParams = { page: 0, size: 10, sortBy: 'id', sortDir: 'asc' }
  ): Promise<PaginatedResponse<UserResponseDto>> {
    const params = new URLSearchParams();
    
    // Add filters
    if (filters.username) params.append('username', filters.username);
    if (filters.email) params.append('email', filters.email);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    
    // Add pagination
    params.append('page', pagination.page.toString());
    params.append('size', pagination.size.toString());
    params.append('sortBy', pagination.sortBy);
    params.append('sortDir', pagination.sortDir);

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    return apiClient.get<PaginatedResponse<UserResponseDto>>(url);
  }

  // Get user by ID
  async getUserById(id: string): Promise<UserResponseDto> {
    return apiClient.get<UserResponseDto>(`${this.baseUrl}/${id}`);
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<UserResponseDto> {
    return apiClient.get<UserResponseDto>(`${this.baseUrl}/username/${username}`);
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<UserResponseDto> {
    return apiClient.get<UserResponseDto>(`${this.baseUrl}/email/${email}`);
  }

  // Create new user
  async createUser(userData: CreateUserRequestDto): Promise<UserResponseDto> {
    return apiClient.post<UserResponseDto>(this.baseUrl, userData);
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserRequestDto): Promise<UserResponseDto> {
    return apiClient.put<UserResponseDto>(`${this.baseUrl}/${id}`, userData);
  }

  // Update user status
  async updateUserStatus(id: string, status: UserStatus): Promise<UserResponseDto> {
    return apiClient.patch<UserResponseDto>(`${this.baseUrl}/${id}/status`, { status });
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export const usersService = new UsersService(); 