import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  Plus,
  Minus,
  ShoppingCart,
  Edit3,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useCart } from "@/features/order/hooks/use-order";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

// Error boundary for cart item rendering
function CartItemErrorBoundary({ children, onError }: { children: React.ReactNode; onError: () => void }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasError) {
      onError();
    }
  }, [hasError, onError]);

  if (hasError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 text-sm">Error loading item</p>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setHasError(false)}
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Retry
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

// Memoized cart item component for better performance
const CartItem = React.memo(function CartItem({
  item,
  index,
  onUpdateQuantity,
  onRemove,
  onEditInstructions,
  isEditing,
  editInstructions,
  onSaveInstructions,
  onCancelEdit,
  onInstructionsChange,
}: {
  item: {
    menuItem: {
      id: string;
      name: string;
      price: number;
      imageUrl?: string;
    };
    quantity: number;
    specialInstructions?: string;
  };
  index: number;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onEditInstructions: (index: number, instructions?: string) => void;
  isEditing: boolean;
  editInstructions: string;
  onSaveInstructions: (index: number, quantity: number) => void;
  onCancelEdit: () => void;
  onInstructionsChange: (value: string) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = useCallback(async (newQuantity: number) => {
    setIsUpdating(true);
    try {
      await onUpdateQuantity(index, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [index, onUpdateQuantity]);

  const handleRemove = useCallback(async () => {
    setIsUpdating(true);
    try {
      await onRemove(index);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setIsUpdating(false);
    }
  }, [index, onRemove]);

  const itemTotal = useMemo(() => {
    return (item.menuItem.price * item.quantity).toFixed(2);
  }, [item.menuItem.price, item.quantity]);

  return (
    <div className={cn(
      "bg-white border rounded-lg p-4 space-y-3 transition-opacity",
      isUpdating && "opacity-50 pointer-events-none"
    )}>
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
          <LoadingSpinner size="sm" />
        </div>
      )}
      
      <div className="flex gap-3">
        {item.menuItem.imageUrl && !imageError ? (
          <img
            src={item.menuItem.imageUrl}
            alt={item.menuItem.name}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-gray-400" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-lg truncate">{item.menuItem.name}</h4>
          <p className="text-sm text-gray-600">
            ${item.menuItem.price.toFixed(2)} each
          </p>
          {item.specialInstructions && (
            <p className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 line-clamp-2">
              Note: {item.specialInstructions}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-lg">
            ${itemTotal}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium" aria-label={`Quantity: ${item.quantity}`}>
            {item.quantity}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEditInstructions(index, item.specialInstructions)}
            disabled={isUpdating}
            aria-label="Edit special instructions"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label="Remove item from cart"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isEditing && (
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-sm">Special Instructions</Label>
          <Textarea
            value={editInstructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            placeholder="Add special instructions..."
            rows={2}
            className="text-sm"
            maxLength={500}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onSaveInstructions(index, item.quantity)}
              disabled={isUpdating}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancelEdit}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export function CartSummary({ 
  isOpen, 
  onClose, 
  onCheckout 
}: CartSummaryProps) {
  const { 
    cartItems, 
    updateCartItemByIndex, 
    removeCartItemByIndex, 
    getCartTotal, 
    getCartItemCount,
    refreshCart,
    isLoaded
  } = useCart();

  console.log('cartItems', cartItems);
  
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editInstructions, setEditInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const lastCartItemsRef = useRef(cartItems);

  // Force re-render when cart items change
  useEffect(() => {
    if (JSON.stringify(lastCartItemsRef.current) !== JSON.stringify(cartItems)) {
      lastCartItemsRef.current = cartItems;
    }
  }, [cartItems]);

  useEffect(() => {
    if (isOpen) {
      refreshCart();
    }
  }, [isOpen]);

  // Memoized calculations
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = getCartTotal();
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [getCartTotal]);

  const itemCount = useMemo(() => getCartItemCount(), [getCartItemCount]);

  // Optimized handlers
  const handleEditInstructions = useCallback((index: number, currentInstructions?: string) => {
    setEditingItem(index);
    setEditInstructions(currentInstructions || "");
  }, []);

  const handleSaveInstructions = useCallback(async (index: number, quantity: number) => {
    setIsLoading(true);
    try {
      await updateCartItemByIndex(index, quantity, editInstructions);
      setEditingItem(null);
      setEditInstructions("");
    } catch (error) {
      console.error('Failed to save instructions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [editInstructions, updateCartItemByIndex]);

  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
    setEditInstructions("");
  }, []);

  const handleInstructionsChange = useCallback((value: string) => {
    setEditInstructions(value);
  }, []);

  const handleUpdateQuantity = useCallback(async (index: number, quantity: number) => {
    return updateCartItemByIndex(index, quantity);
  }, [updateCartItemByIndex]);

  const handleRemoveItem = useCallback(async (index: number) => {
    return removeCartItemByIndex(index);
  }, [removeCartItemByIndex]);

  const handleCartError = useCallback(() => {
    // Could trigger a cart refresh or show error message
    console.warn('Cart item error detected');
  }, []);

  // Don't render if cart isn't loaded yet
  if (!isLoaded) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Order ({itemCount} item{itemCount !== 1 ? 's' : ''})
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshCart}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Refresh cart"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Review and modify your items before checkout
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Add some delicious items to get started!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4" role="list" aria-label="Cart items">
                {cartItems.map((item, index) => (
                  <div key={`${item.menuItem.id}-${index}-${item.specialInstructions || 'no-instructions'}`} role="listitem">
                    <CartItemErrorBoundary onError={handleCartError}>
                      <CartItem
                        item={item}
                        index={index}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        onEditInstructions={handleEditInstructions}
                        isEditing={editingItem === index}
                        editInstructions={editInstructions}
                        onSaveInstructions={handleSaveInstructions}
                        onCancelEdit={handleCancelEdit}
                        onInstructionsChange={handleInstructionsChange}
                      />
                    </CartItemErrorBoundary>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Continue Ordering
          </Button>
          {cartItems.length > 0 && (
            <Button 
              onClick={onCheckout} 
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 