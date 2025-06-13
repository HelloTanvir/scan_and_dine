"use client";

import React from 'react';
import { useAuth } from '@/contexts/auth.context';
import { useRouter, usePathname } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle } from 'lucide-react';
import { UserRole } from '@/lib/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallback 
}: Readonly<ProtectedRouteProps>) {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }

  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <strong>Required roles:</strong>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {requiredRoles.map((role) => (
                  <li key={role} className="capitalize">{role}</li>
                ))}
              </ul>
              <div className="mt-2">
                <strong>Your role:</strong> <span className="capitalize">{user?.role}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.back()} 
                variant="outline" 
                className="flex-1"
              >
                Go Back
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')} 
                className="flex-1"
              >
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: UserRole[]
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredRoles={requiredRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
} 