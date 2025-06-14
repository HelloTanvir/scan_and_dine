import { useState, useEffect } from "react";
import { CreateOrderData, Order, CartItem, Menu } from "@/lib/types";
import { orderService } from "../services/order.service";
import { API_ENDPOINTS } from "@/lib/constants";

const CART_STORAGE_KEY = "scan_and_dine_cart";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (menuItem: Menu, quantity: number = 1, specialInstructions?: string) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        item.menuItem.id === menuItem.id && 
        item.specialInstructions === specialInstructions
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item with same special instructions
        return prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Add new item or item with different special instructions
      return [...prev, { menuItem, quantity, specialInstructions }];
    });
  };

  const updateCartItem = (menuItemId: string, quantity: number, specialInstructions?: string) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId, specialInstructions);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.menuItem.id === menuItemId && item.specialInstructions === specialInstructions
          ? { ...item, quantity, specialInstructions }
          : item
      )
    );
  };

  const removeFromCart = (menuItemId: string, specialInstructions?: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.menuItem.id === menuItemId && item.specialInstructions === specialInstructions)
    ));
  };

  const removeCartItemByIndex = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartItemByIndex = (index: number, quantity: number, specialInstructions?: string) => {
    if (quantity <= 0) {
      removeCartItemByIndex(index);
      return;
    }

    setCartItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity, specialInstructions }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cart from localStorage:", error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartTax = (taxRate: number = 0.08) => {
    return getCartTotal() * taxRate;
  };

  const getCartTotalWithTax = (taxRate: number = 0.08) => {
    return getCartTotal() + getCartTax(taxRate);
  };

  const isItemInCart = (menuItemId: string) => {
    return cartItems.some(item => item.menuItem.id === menuItemId);
  };

  const getItemQuantityInCart = (menuItemId: string) => {
    // Sum all quantities for this menu item (including different special instructions)
    return cartItems
      .filter(item => item.menuItem.id === menuItemId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartTax,
    getCartTotalWithTax,
    isItemInCart,
    getItemQuantityInCart,
    removeCartItemByIndex,
    updateCartItemByIndex,
    isLoaded, // Expose this to know when cart is ready
  };
}

export function useOrderCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const order = await orderService.createOrder(orderData);
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create order";
      setError(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    createOrder,
    isCreating,
    error,
    clearError,
  };
}

export function useKitchenOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const activeOrders = await orderService.getActiveOrdersForKitchen();
      setOrders(activeOrders);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch orders";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update order status";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchActiveOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    orders,
    isLoading,
    error,
    fetchActiveOrders,
    updateOrderStatus,
  };
}

// Hook for fetching menu items without authentication (for customer order page)
export function usePublicMenu() {
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      // Try the backend API first
      const response = await fetch(`${API_ENDPOINTS.MENU}?size=100`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch menu items from backend");
      }

      const data = await response.json();
      setMenuItems(data.content || []);
      setError(null);
    } catch (err) {
      console.warn("Backend not available, using mock data:", err);
      // Fallback to mock data
      const mockMenuItems: Menu[] = [
        {
          id: "1",
          name: "Beef Ribeye Steak",
          description: "Premium ribeye steak cooked to your preference with garlic mashed potatoes",
          price: 42.99,
          category: "MAIN_COURSE",
          imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
          isAvailable: true,
          isFeatured: true,
          ingredients: ["Beef", "Garlic", "Potatoes", "Butter"],
          allergens: ["Dairy"],
          dietaryTags: ["Gluten-Free", "High Protein"],
          preparationTimeMinutes: 30,
          calories: 650,
          spiceLevel: "Mild",
          rating: 4.8,
          reviewCount: 124,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Grilled Salmon",
          description: "Fresh Atlantic salmon with lemon herb butter and seasonal vegetables",
          price: 28.99,
          category: "MAIN_COURSE",
          imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
          isAvailable: true,
          isFeatured: false,
          ingredients: ["Salmon", "Lemon", "Herbs", "Vegetables"],
          allergens: ["Fish"],
          dietaryTags: ["Gluten-Free", "Omega-3"],
          preparationTimeMinutes: 20,
          calories: 420,
          spiceLevel: "Mild",
          rating: 4.6,
          reviewCount: 89,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Chicken Noodle Soup",
          description: "Classic comfort soup with tender chicken and vegetables",
          price: 8.99,
          category: "SOUP",
          imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
          isAvailable: true,
          isFeatured: false,
          ingredients: ["Chicken", "Noodles", "Carrots", "Celery"],
          allergens: ["Gluten"],
          dietaryTags: ["Comfort Food"],
          preparationTimeMinutes: 20,
          calories: 280,
          spiceLevel: "Mild",
          rating: 4.8,
          reviewCount: 156,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Caesar Salad",
          description: "Crisp romaine lettuce with parmesan cheese and croutons",
          price: 12.99,
          category: "SALAD",
          imageUrl: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400",
          isAvailable: true,
          isFeatured: false,
          ingredients: ["Romaine", "Parmesan", "Croutons", "Caesar Dressing"],
          allergens: ["Dairy", "Gluten"],
          dietaryTags: ["Vegetarian"],
          preparationTimeMinutes: 10,
          calories: 320,
          spiceLevel: "Mild",
          rating: 4.4,
          reviewCount: 67,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Chocolate Lava Cake",
          description: "Warm chocolate cake with molten center and vanilla ice cream",
          price: 9.99,
          category: "DESSERT",
          imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
          isAvailable: true,
          isFeatured: true,
          ingredients: ["Chocolate", "Flour", "Eggs", "Vanilla Ice Cream"],
          allergens: ["Dairy", "Gluten", "Eggs"],
          dietaryTags: ["Sweet"],
          preparationTimeMinutes: 15,
          calories: 480,
          spiceLevel: "None",
          rating: 4.9,
          reviewCount: 203,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setMenuItems(mockMenuItems);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    isLoading,
    error,
    refetch: fetchMenuItems,
  };
} 