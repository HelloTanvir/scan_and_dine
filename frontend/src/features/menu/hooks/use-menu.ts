"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Menu, 
  CreateMenuData, 
  UpdateMenuData, 
  MenuCategory 
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Menu Management Hook
export function useMenuManagement() {
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/menu?size=100`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }

      const data = await response.json();
      setMenuItems(data.content || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Failed to load menu items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMenuItem = async (data: CreateMenuData) => {
    try {
      setIsCreating(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create menu item");
      }

      const newMenuItem = await response.json();
      setMenuItems(prev => [...prev, newMenuItem]);
      
      console.log("Menu item created successfully");
    } catch (err) {
      console.error("Failed to create menu item:", (err as Error).message);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateMenuItem = async (id: string, data: UpdateMenuData) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update menu item");
      }

      const updatedMenuItem = await response.json();
      setMenuItems(prev => 
        prev.map(item => item.id === id ? updatedMenuItem : item)
      );
      
      console.log("Menu item updated successfully");
    } catch (err) {
      console.error("Failed to update menu item:", (err as Error).message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateAvailability = async (id: string, isAvailable: boolean) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/menu/${id}/availability`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable }),
      });

      if (!response.ok) {
        throw new Error("Failed to update availability");
      }

      const updatedMenuItem = await response.json();
      setMenuItems(prev => 
        prev.map(item => item.id === id ? updatedMenuItem : item)
      );
      
      console.log(`Menu item ${isAvailable ? 'made available' : 'made unavailable'}`);
    } catch (err) {
      console.error("Failed to update availability:", (err as Error).message);
    }
  };

  const handleUpdateFeaturedStatus = async (id: string, isFeatured: boolean) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/menu/${id}/featured`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFeatured }),
      });

      if (!response.ok) {
        throw new Error("Failed to update featured status");
      }

      const updatedMenuItem = await response.json();
      setMenuItems(prev => 
        prev.map(item => item.id === id ? updatedMenuItem : item)
      );
      
      console.log(`Menu item ${isFeatured ? 'marked as featured' : 'unmarked as featured'}`);
    } catch (err) {
      console.error("Failed to update featured status:", (err as Error).message);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete menu item");
      }

      setMenuItems(prev => prev.filter(item => item.id !== id));
      
      console.log("Menu item deleted successfully");
    } catch (err) {
      console.error("Failed to delete menu item:", (err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreateMenuItem,
    handleUpdateMenuItem,
    handleUpdateAvailability,
    handleUpdateFeaturedStatus,
    handleDeleteMenuItem,
    refetch: fetchMenuItems,
  };
}

// Menu Filters Hook
export function useMenuFilters(menuItems: Menu[]) {
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | "all">("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "not-featured">("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState<[number, number]>([0, 1000]);

  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(menuItems.map(item => item.category)));
    return categories.sort();
  }, [menuItems]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const categoryMatch = categoryFilter === "all" || item.category === categoryFilter;
      
      const availabilityMatch = availabilityFilter === "all" || 
        (availabilityFilter === "available" && item.isAvailable) ||
        (availabilityFilter === "unavailable" && !item.isAvailable);
      
      const featuredMatch = featuredFilter === "all" ||
        (featuredFilter === "featured" && item.isFeatured) ||
        (featuredFilter === "not-featured" && !item.isFeatured);
      
      const priceMatch = item.price >= priceRangeFilter[0] && item.price <= priceRangeFilter[1];

      return categoryMatch && availabilityMatch && featuredMatch && priceMatch;
    });
  }, [menuItems, categoryFilter, availabilityFilter, featuredFilter, priceRangeFilter]);

  return {
    filteredMenuItems,
    categoryFilter,
    setCategoryFilter,
    availabilityFilter,
    setAvailabilityFilter,
    featuredFilter,
    setFeaturedFilter,
    priceRangeFilter,
    setPriceRangeFilter,
    availableCategories,
  };
} 