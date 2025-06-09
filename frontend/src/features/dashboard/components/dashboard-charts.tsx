import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ChartData } from '@/lib/types';
import { CHART_COLORS } from '@/lib/constants';

interface DashboardChartsProps {
  dailyOrdersData: ChartData[] | null;
  menuCategoryData: ChartData[] | null;
  isLoading: boolean;
}

export const DashboardCharts = React.memo(function DashboardCharts({
  dailyOrdersData,
  menuCategoryData,
  isLoading,
}: DashboardChartsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-center h-80">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-center h-80">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Daily Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Orders</CardTitle>
          <CardDescription>Orders received this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyOrdersData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Menu Category Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Categories</CardTitle>
          <CardDescription>Orders by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={menuCategoryData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(menuCategoryData || []).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}); 