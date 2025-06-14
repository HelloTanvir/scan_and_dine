import React from "react";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";
import { Menu } from "@/lib/types";
import { MenuItemCard } from "./MenuItemCard";

interface CartItem {
  menuItem: Menu;
  quantity: number;
  specialInstructions?: string;
}

interface MenuGridProps {
  menuItems: Menu[];
  searchQuery: string;
  selectedCategory: string;
  cartItems: CartItem[];
  onAddToCart: (item: Menu, quantity: number, specialInstructions?: string) => void;
  onQuickAdd: (item: Menu) => void;
}

export function MenuGrid({
  menuItems,
  searchQuery,
  selectedCategory,
  cartItems,
  onAddToCart,
  onQuickAdd
}: MenuGridProps) {
  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        {searchQuery ? (
          <>
            <p className="text-gray-500 text-lg mb-2">No items found</p>
            <p className="text-gray-400">Try adjusting your search or browse all categories</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Clear Search
            </Button>
          </>
        ) : selectedCategory === "favorites" ? (
          <>
            <p className="text-gray-500 text-lg mb-2">No favorites yet</p>
            <p className="text-gray-400">Tap the heart icon on items you love to save them here</p>
          </>
        ) : (
          <>
            <p className="text-gray-500 text-lg">No items available in this category</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {menuItems.map((menuItem) => {
        const isInCart = cartItems.some(item => item.menuItem.id === menuItem.id);
        const totalQuantity = cartItems
          .filter(item => item.menuItem.id === menuItem.id)
          .reduce((total, item) => total + item.quantity, 0);
        
        return (
          <MenuItemCard
            key={menuItem.id}
            menuItem={menuItem}
            onAddToCart={onAddToCart}
            onQuickAdd={onQuickAdd}
            isInCart={isInCart}
            cartQuantity={totalQuantity}
          />
        );
      })}
    </div>
  );
} 