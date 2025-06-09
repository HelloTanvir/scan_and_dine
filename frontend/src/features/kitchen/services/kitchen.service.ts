import { Order, OrderStatus } from '@/lib/types';
import { mockOrders } from '@/lib/services/mock-data';

export class KitchenService {
  private orders: Order[] = [...mockOrders];

  async getOrders(): Promise<Order[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.orders];
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.orders.filter(order => order.status === status);
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      status: newStatus,
      updatedAt: new Date(),
    };

    return this.orders[orderIndex];
  }

  getOrderStatusCounts() {
    const counts = {
      pending: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    };

    this.orders.forEach(order => {
      counts[order.status]++;
    });

    return counts;
  }
}

export const kitchenService = new KitchenService(); 