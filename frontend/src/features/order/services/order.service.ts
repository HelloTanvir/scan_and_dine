import { CreateOrderData, Order } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";

export class OrderService {
  private readonly baseUrl = API_ENDPOINTS.ORDERS;

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create order");
    }

    return response.json();
  }

  async getOrderById(orderId: string): Promise<Order> {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${this.baseUrl}/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }

    return response.json();
  }

  async getActiveOrdersForKitchen(): Promise<Order[]> {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${this.baseUrl}/kitchen/active`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch kitchen orders");
    }

    return response.json();
  }

  async getReadyOrders(): Promise<Order[]> {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${this.baseUrl}/kitchen/ready`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch ready orders");
    }

    return response.json();
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${this.baseUrl}/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    return response.json();
  }

  async getOrdersByTableId(tableId: string): Promise<Order[]> {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${this.baseUrl}/table/${tableId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch table orders");
    }

    return response.json();
  }
}

export const orderService = new OrderService(); 