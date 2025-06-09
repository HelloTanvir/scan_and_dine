import { useState, useCallback } from 'react';
import { useApi } from '@/lib/hooks/use-api';
import { kitchenService } from '../services/kitchen.service';
import { OrderStatus } from '@/lib/types';

export function useKitchenOrders() {
  return useApi(
    () => kitchenService.getOrders(),
    { immediate: true }
  );
}

export function useOrdersByStatus(status: OrderStatus) {
  return useApi(
    () => kitchenService.getOrdersByStatus(status),
    { immediate: true }
  );
}

export function useUpdateOrderStatus() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const updateStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    setUpdatingOrderId(orderId);
    try {
      const result = await kitchenService.updateOrderStatus(orderId, newStatus);
      return result;
    } finally {
      setIsUpdating(false);
      setUpdatingOrderId(null);
    }
  }, []);

  return {
    updateStatus,
    isUpdating,
    updatingOrderId,
  };
}

// New hook for optimized kitchen management
export function useKitchenManagement() {
  const { data: orders, isLoading, error, execute: refetchOrders } = useKitchenOrders();
  const { updateStatus, isUpdating, updatingOrderId } = useUpdateOrderStatus();

  const handleUpdateStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateStatus(orderId, newStatus);
      // Only refetch if needed - for now we'll skip auto-refetch to prevent infinite loading
      // In a real app, you'd use optimistic updates or websockets
    } catch (error) {
      console.error('Failed to update order status:', error);
      // On error, refetch to ensure consistency
      await refetchOrders();
    }
  }, [updateStatus, refetchOrders]);

  const getFilteredOrders = useCallback((status: OrderStatus) => {
    return orders?.filter(order => order.status === status) || [];
  }, [orders]);

  return {
    orders: orders || [],
    isLoading,
    error,
    handleUpdateStatus,
    isUpdating,
    updatingOrderId,
    getFilteredOrders,
    refetchOrders,
  };
} 