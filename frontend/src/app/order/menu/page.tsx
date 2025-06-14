"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useToast } from "@/components/ui/toast";
import { 
  useCart, 
  useOrderCreation,
  usePublicMenu
} from "@/features/order/hooks/use-order";
import {
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { Menu, MenuCategory, CreateOrderData, Order } from "@/lib/types";

// Import new modular components
import { SearchAndFilters } from "@/components/menu/SearchAndFilters";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { CartSummary } from "@/components/cart/CartSummary";
import { CheckoutDialog } from "@/components/checkout/CheckoutDialog";
import { OrderSuccessDialog } from "@/components/order/OrderSuccessDialog";
import { FixedCartButton } from "@/components/common/FixedCartButton";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function CustomerOrderPage() {
  const searchParams = useSearchParams();
  const tableIdParam = searchParams.get("tableId");
  const tableNumberParam = searchParams.get("table");
  
  const tableId = tableIdParam;
  
  const { menuItems, isLoading: isLoadingMenu } = usePublicMenu();
  const { 
    cartItems, 
    addToCart, 
    getCartTotal, 
    getCartItemCount, 
    clearCart,
    refreshCart,
    isLoaded: isCartLoaded
  } = useCart();
  const { createOrder, isCreating, error } = useOrderCreation();
  const { showToast, ToastContainer } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "all" | "favorites">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  const filteredMenuItems = useMemo(() => {
    let items = menuItems.filter(item => item.isAvailable);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.dietaryTags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory === "favorites") {
      items = items.filter(item => favorites.includes(item.id));
    } else if (selectedCategory !== "all") {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    return items;
  }, [menuItems, searchQuery, selectedCategory, favorites]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(menuItems.filter(item => item.isAvailable).map(item => item.category)));
  }, [menuItems]);

  const handleQuickAdd = (menuItem: Menu) => {
    addToCart(menuItem, 1);
    // Force immediate refresh for UI responsiveness
    setTimeout(refreshCart, 100);
    showToast({
      message: `${menuItem.name} added to cart!`,
      type: "success",
      duration: 2000,
    });
  };

  const handleAddToCart = (menuItem: Menu, quantity: number, specialInstructions?: string) => {
    addToCart(menuItem, quantity, specialInstructions);
    // Force immediate refresh for UI responsiveness
    setTimeout(refreshCart, 100);
    showToast({
      message: `${quantity}x ${menuItem.name} added to cart!`,
      type: "success",
      duration: 2000,
    });
  };

  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  const handleCheckout = async (customerData: { 
    name: string; 
    phone: string; 
    email?: string; 
    instructions?: string;
    paymentData: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardName: string;
    };
  }) => {
    if (!tableId) {
      alert("Table ID is missing. Please scan the QR code again.");
      return;
    }

    const orderData: CreateOrderData = {
      customerName: customerData.name,
      customerPhone: customerData.phone,
      customerEmail: customerData.email || undefined,
      tableId,
      orderItems: cartItems.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      })),
      specialInstructions: customerData.instructions || undefined,
    };

    const order = await createOrder(orderData);
    if (order) {
      setPlacedOrder(order);
      setIsCheckoutOpen(false);
      setIsSuccessOpen(true);
      clearCart();
    }
  };

  if (!tableId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="text-xl font-semibold">Invalid Access</h1>
            <p className="text-gray-600">
              {tableNumberParam 
                ? `Table ${tableNumberParam} found, but we need the complete QR code information to place orders. Please scan the QR code from your table.`
                : "Please scan the QR code from your table to access the menu."
              }
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingMenu || !isCartLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-green-900">Scan & Dine</h1>
              <p className="text-sm text-gray-600">Table {tableNumberParam || 'Loading...'}</p>
            </div>
            
            <Button
              onClick={handleCartOpen}
              className="relative bg-green-600 hover:bg-green-700 shadow-sm"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Cart</span>
              {getCartItemCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                  {getCartItemCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        availableCategories={availableCategories}
        favoritesCount={favorites.length}
      />

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {searchQuery && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {filteredMenuItems.length} result{filteredMenuItems.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
        
        <MenuGrid
          menuItems={filteredMenuItems}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onQuickAdd={handleQuickAdd}
        />
      </div>

      {/* Fixed Cart Button for Mobile */}
      <FixedCartButton
        itemCount={getCartItemCount()}
        total={getCartTotal()}
        onClick={handleCartOpen}
      />

      {/* Dialogs */}
      <CartSummary
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckout}
        isLoading={isCreating}
      />

      <OrderSuccessDialog
        isOpen={isSuccessOpen}
        order={placedOrder}
        onClose={() => setIsSuccessOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />
      
      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
} 