import { DashboardStats, ChartData } from '@/lib/types';
import { mockDashboardStats, mockDailyOrdersData, mockMenuCategoryData } from '@/lib/services/mock-data';

export class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDashboardStats;
  }

  async getDailyOrdersData(): Promise<ChartData[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDailyOrdersData;
  }

  async getMenuCategoryData(): Promise<ChartData[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMenuCategoryData;
  }
}

export const dashboardService = new DashboardService(); 