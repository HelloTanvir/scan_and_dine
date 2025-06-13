"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthContextType, LoginRequest, User, UserRole } from '@/lib/types/auth';
import { authService } from '@/lib/services/auth.service';

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'TOKEN_REFRESH'; payload: { accessToken: string; refreshToken: string } }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'TOKEN_REFRESH':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = authService.getAuthToken();
        const refreshToken = authService.getRefreshToken();
        const user = authService.getUser();

        if (accessToken && refreshToken && user) {
          // Check if token is expired first
          if (authService.isTokenExpired(accessToken)) {
            console.log('Access token expired, attempting refresh...');
            try {
              const response = await authService.refreshToken(refreshToken);
              authService.setAuthToken(response.accessToken);
              authService.setRefreshToken(response.refreshToken);
              
              const currentUser = await authService.getCurrentUser();
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                  user: currentUser,
                  accessToken: response.accessToken,
                  refreshToken: response.refreshToken,
                },
              });
              console.log('Token refresh successful during initialization');
            } catch (refreshError) {
              console.error('Token refresh failed during initialization:', refreshError);
              authService.clearTokens();
              authService.clearUser();
              dispatch({ type: 'AUTH_FAILURE' });
            }
          } else {
            // Token not expired, verify it's still valid by calling /me endpoint
            try {
              const currentUser = await authService.getCurrentUser();
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                  user: currentUser,
                  accessToken,
                  refreshToken,
                },
              });
              console.log('Token validation successful');
            } catch {
              // Token is invalid, try to refresh
              console.log('Token validation failed, attempting refresh...');
              try {
                const response = await authService.refreshToken(refreshToken);
                authService.setAuthToken(response.accessToken);
                authService.setRefreshToken(response.refreshToken);
                
                const currentUser = await authService.getCurrentUser();
                dispatch({
                  type: 'AUTH_SUCCESS',
                  payload: {
                    user: currentUser,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                  },
                });
                console.log('Token refresh successful after validation failure');
              } catch {
                // Refresh failed, clear everything
                console.error('Token refresh failed, clearing auth state');
                authService.clearTokens();
                authService.clearUser();
                dispatch({ type: 'AUTH_FAILURE' });
              }
            }
          }
        } else {
          dispatch({ type: 'AUTH_FAILURE' });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        dispatch({ type: 'AUTH_FAILURE' });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authService.login(credentials);
      
      // Store tokens and user data
      authService.setAuthToken(response.accessToken);
      authService.setRefreshToken(response.refreshToken);
      authService.setUser(response.user);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call result
      authService.clearTokens();
      authService.clearUser();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Refresh access token
  const refreshAccessToken = async (): Promise<void> => {
    const refreshToken = authService.getRefreshToken();
    
    if (!refreshToken) {
      console.warn('No refresh token available, logging out user');
      await logout();
      throw new Error('No refresh token available');
    }

    try {
      const response = await authService.refreshToken(refreshToken);
      
      authService.setAuthToken(response.accessToken);
      authService.setRefreshToken(response.refreshToken);
      
      dispatch({
        type: 'TOKEN_REFRESH',
        payload: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
      });
      
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  // Check if user has specific roles
  const hasRole = (roles: UserRole[]): boolean => {
    return authService.hasRole(state.user, roles);
  };

  // Check if user has permission for specific route
  const hasPermission = (route: string): boolean => {
    return authService.hasRoutePermission(state.user, route);
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshAccessToken,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 