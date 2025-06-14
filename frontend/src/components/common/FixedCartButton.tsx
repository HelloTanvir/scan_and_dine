import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface FixedCartButtonProps {
  itemCount: number;
  total: number;
  onClick: () => void;
}

export function FixedCartButton({ itemCount, total, onClick }: FixedCartButtonProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 md:hidden z-50">
      <Button
        onClick={onClick}
        className="relative bg-green-600 hover:bg-green-700 shadow-lg h-14 px-6 rounded-full"
        size="lg"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">${total.toFixed(2)}</span>
          <span className="text-xs opacity-90">{itemCount} items</span>
        </div>
        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
          {itemCount}
        </Badge>
      </Button>
    </div>
  );
} 