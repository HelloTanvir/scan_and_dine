import { useApi } from '@/lib/hooks/use-api';
import { dashboardService } from '../services/dashboard.service';

export function useDashboardStats() {
  return useApi(
    () => dashboardService.getDashboardStats(),
    { immediate: true }
  );
}

export function useDailyOrdersData() {
  return useApi(
    () => dashboardService.getDailyOrdersData(),
    { immediate: true }
  );
}

export function useMenuCategoryData() {
  return useApi(
    () => dashboardService.getMenuCategoryData(),
    { immediate: true }
  );
} 