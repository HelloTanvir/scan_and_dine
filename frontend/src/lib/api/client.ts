import { AppError } from '@/lib/types';
import { API_BASE_URL } from '@/lib/constants';

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle 401 Unauthorized errors
      if (response.status === 401 && !response.url.includes('/auth/login')) {
        const token = await this.handleTokenRefresh();
        if (token) {
          throw new Error('TOKEN_REFRESHED'); // Special error to retry request
        }
      }

      const error: AppError = {
        message: `HTTP error! status: ${response.status}`,
        code: response.status.toString(),
      };
      
      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.details = errorData;
      } catch {
        // If response is not JSON, use default error message
      }
      
      throw error;
    }

    try {
      return await response.json();
    } catch {
      throw new Error('Invalid JSON response');
    }
  }

  private async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Import authService dynamically to avoid circular dependency
      const { authService } = await import('@/lib/services/auth.service');
      const response = await authService.refreshToken(refreshToken);
      
      // Update stored tokens
      authService.setAuthToken(response.accessToken);
      authService.setRefreshToken(response.refreshToken);

      // Process queued requests
      this.processQueue(response.accessToken);

      return response.accessToken;
    } catch (error) {
      // Process queue with error
      this.processQueue(null, error as Error);
      
      // Clear tokens and redirect to login
      this.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(token: string | null, error?: Error) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      } else {
        reject(new Error('Token refresh failed'));
      }
    });
    
    this.failedQueue = [];
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    retryCount = 0
  ): Promise<T> {
    try {
      // If endpoint already has base URL, use it as is, otherwise prepend baseURL
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        method,
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      // Handle token refresh retry
      if (error instanceof Error && error.message === 'TOKEN_REFRESHED' && retryCount === 0) {
        // Retry the request with new token
        return this.makeRequest<T>(method, endpoint, data, retryCount + 1);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.makeRequest<T>('PUT', endpoint, data);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.makeRequest<T>('PATCH', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint);
  }
}

export const apiClient = new ApiClient();
export default ApiClient; 