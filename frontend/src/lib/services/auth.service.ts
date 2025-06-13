import { apiClient } from '@/lib/api/client';
import { LoginRequest, LoginResponse, RefreshTokenResponse, User, UserRole } from '@/lib/types/auth';
import { API_ENDPOINTS, ROLE_DEFAULT_ROUTES } from '@/lib/constants';

class AuthService {
  private readonly endpoints = {
    login: `${API_ENDPOINTS.AUTH}/login`,
    refresh: `${API_ENDPOINTS.AUTH}/refresh-token`,
    logout: `${API_ENDPOINTS.AUTH}/logout`,
    me: `${API_ENDPOINTS.AUTH}/me`,
  };

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(this.endpoints.login, credentials);
    return response;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      this.endpoints.refresh,
      { refreshToken }
    );
    return response;
  }

  async logout(): Promise<void> {
    await apiClient.post(this.endpoints.logout);
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(this.endpoints.me);
    return response;
  }

  // Token management - moved to bottom with timestamp tracking

  getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // User data management
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  clearUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  // Check if user has specific roles
  hasRole(user: User | null, roles: string[]): boolean {
    if (!user) return false;
    return roles.includes(user.role);
  }

  // Check if user has permission for specific route
  hasRoutePermission(user: User | null, route: string): boolean {
    if (!user) return false;

    const permissions: Record<string, string[]> = {
      '/dashboard': ['ADMIN'],
      '/kitchen': ['ADMIN', 'MANAGER', 'STAFF'],
      '/tables': ['ADMIN', 'MANAGER'],
      '/users': ['ADMIN'],
    };

    const allowedRoles = permissions[route];
    return allowedRoles ? allowedRoles.includes(user.role) : false;
  }

  // Get default route for user role
  getDefaultRouteForRole(role: UserRole): string {
    return ROLE_DEFAULT_ROUTES[role] || '/dashboard';
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      // Decode JWT token and check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      // If we can't decode the token, consider it expired
      return true;
    }
  }

  // Token management
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }
}

export const authService = new AuthService(); 