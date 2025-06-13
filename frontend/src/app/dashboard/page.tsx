"use client";

import React from 'react';
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { StatsCard } from '@/features/dashboard/components/stats-card';
import { DashboardCharts } from '@/features/dashboard/components/dashboard-charts';
import { RecentOrdersTable } from '@/features/dashboard/components/recent-orders-table';
import { useDashboardStats, useDailyOrdersData, useMenuCategoryData } from '@/features/dashboard/hooks/use-dashboard';
import { mockOrders } from '@/lib/services/mock-data';
import { CURRENCY } from '@/lib/constants';
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
} from "lucide-react";

function DashboardStats() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Failed to load dashboard stats</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={`${CURRENCY}${stats.totalRevenue.toLocaleString()}`}
        change={stats.revenueChange}
        icon={DollarSign}
      />
      <StatsCard
        title="Total Orders"
        value={stats.totalOrders}
        change={stats.ordersChange}
        icon={ShoppingBag}
      />
      <StatsCard
        title="Avg. Order Value"
        value={`${CURRENCY}${stats.avgOrderValue}`}
        change={stats.avgOrderChange}
        icon={TrendingUp}
      />
      <StatsCard
        title="Active Tables"
        value={`${stats.activeTables.active}/${stats.activeTables.total}`}
        icon={Users}
      />
    </div>
  );
}

function DashboardContent() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: dailyOrdersData, isLoading: dailyLoading } = useDailyOrdersData();
  const { data: menuCategoryData, isLoading: categoryLoading } = useMenuCategoryData();
  
  // Get recent orders (last 5)
  const recentOrders = mockOrders.slice(0, 5);
  
  // Show main loading spinner only on initial load
  const isInitialLoading = statsLoading && !stats;

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-green-900">Admin Dashboard</h1>

      <ErrorBoundary>
        <DashboardStats />
      </ErrorBoundary>

      <ErrorBoundary>
        <DashboardCharts
          dailyOrdersData={dailyOrdersData}
          menuCategoryData={menuCategoryData}
          isLoading={dailyLoading || categoryLoading}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <RecentOrdersTable orders={recentOrders} />
      </ErrorBoundary>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRoles={['ADMIN']}>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
