"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth.context';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { authService } from '@/lib/services/auth.service';

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        const defaultRoute = authService.getDefaultRouteForRole(user.role);
        router.push(defaultRoute);
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
