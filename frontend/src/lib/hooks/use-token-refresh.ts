import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { authService } from '@/lib/services/auth.service';

export function useTokenRefresh() {
  const { isAuthenticated, refreshAccessToken } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear interval if user is not authenticated
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Check token expiration every 5 minutes
    const checkTokenExpiration = async () => {
      const token = authService.getAuthToken();
      if (token && authService.isTokenExpired(token)) {
        console.log('Token expired, refreshing...');
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Automatic token refresh failed:', error);
        }
      }
    };

    // Check immediately and then every 5 minutes
    checkTokenExpiration();
    intervalRef.current = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    // Cleanup interval on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, refreshAccessToken]);
}

// Hook to manually trigger token refresh if needed
export function useManualTokenRefresh() {
  const { refreshAccessToken } = useAuth();

  const refreshIfNeeded = async (): Promise<boolean> => {
    const token = authService.getAuthToken();
    if (!token) return false;

    if (authService.isTokenExpired(token)) {
      try {
        await refreshAccessToken();
        return true;
      } catch (error) {
        console.error('Manual token refresh failed:', error);
        return false;
      }
    }
    return true; // Token is still valid
  };

  return { refreshIfNeeded };
} 