import { useState, useCallback, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/types/index';
import { Order as ApiOrder } from '@/lib/types';
import { orderService } from '@/features/order/services/order.service';

// Transform API Order to Kitchen Order format
function transformApiOrderToKitchenOrder(apiOrder: ApiOrder): Order {
  return {
    id: apiOrder.id,
    tableNumber: apiOrder.tableNumber,
    items: apiOrder.orderItems.map(item => ({
      id: item.id,
      name: item.menuItemName,
      quantity: item.quantity,
      price: item.unitPrice,
      special: item.specialInstructions,
      category: '', // Not available in API response
    })),
    total: apiOrder.totalAmount,
    status: apiOrder.status.toLowerCase() as OrderStatus,
    priority: apiOrder.priority.toLowerCase() as Order['priority'],
    time: new Date(apiOrder.createdAt).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    createdAt: new Date(apiOrder.createdAt),
    updatedAt: apiOrder.updatedAt ? new Date(apiOrder.updatedAt) : undefined,
    customerName: apiOrder.customerName,
    customerPhone: apiOrder.customerPhone,
    notes: apiOrder.specialInstructions,
    paymentStatus: apiOrder.paymentStatus.toLowerCase() as Order['paymentStatus'],
    paymentMethod: apiOrder.paymentMethod?.toLowerCase() as Order['paymentMethod'],
  };
}

export function useKitchenOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch active orders for kitchen (pending, confirmed, preparing)
      const activeOrders = await orderService.getActiveOrdersForKitchen();
      
      // Fetch ready orders
      const readyOrders = await orderService.getReadyOrders();
      
      // Combine all orders for kitchen view
      const allApiOrders = [...activeOrders, ...readyOrders];
      
      // Transform API orders to kitchen format
      const kitchenOrders = allApiOrders.map(transformApiOrderToKitchenOrder);
      
      setOrders(kitchenOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Failed to fetch kitchen orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return {
    data: orders,
    isLoading,
    error,
    execute: fetchOrders,
  };
}

export function useOrdersByStatus(status: OrderStatus) {
  const { data: allOrders, isLoading, error, execute } = useKitchenOrders();
  
  const filteredOrders = allOrders.filter(order => order.status.toLowerCase() === status.toLowerCase());
  
  return {
    data: filteredOrders,
    isLoading,
    error,
    execute,
  };
}

export function useUpdateOrderStatus() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const updateStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    setUpdatingOrderId(orderId);
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus.toUpperCase());
      console.log(`Updated order ${orderId} to status ${newStatus}`);
      return { success: true, order: updatedOrder };
    } catch (err) {
      console.error('Failed to update order status:', err);
      throw err;
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

// Main hook for kitchen management
export function useKitchenManagement() {
  const { data: orders, isLoading, error, execute: refetchOrders } = useKitchenOrders();
  const { updateStatus, isUpdating, updatingOrderId } = useUpdateOrderStatus();

  const handleUpdateStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateStatus(orderId, newStatus);
      // Refetch orders after status update to get latest data
      await refetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      // On error, refetch to ensure consistency
      await refetchOrders();
      throw error; // Re-throw to allow UI to handle the error
    }
  }, [updateStatus, refetchOrders]);

  const getFilteredOrders = useCallback((status: string) => {
    if (!orders) return [];
    
    // Handle different status mappings
    const statusLower = status.toLowerCase();
    return orders.filter(order => {
      const orderStatus = order.status.toLowerCase();
      
      // Map frontend status to backend status
      switch (statusLower) {
        case 'pending':
          return orderStatus === 'pending' || orderStatus === 'confirmed';
        case 'preparing':
          return orderStatus === 'preparing';
        case 'ready':
          return orderStatus === 'ready';
        case 'completed':
          return orderStatus === 'completed' || orderStatus === 'served';
        default:
          return orderStatus === statusLower;
      }
    });
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