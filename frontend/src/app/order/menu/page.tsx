"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useToast } from "@/components/ui/toast";
import { 
  useCart, 
  useOrderCreation,
  usePublicMenu
} from "@/features/order/hooks/use-order";
import {
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  Star,
  Phone,
  Mail,
  User,
  CheckCircle,
  Search,
  X,
  Heart,
  Utensils,
  AlertCircle,
  Trash2,
  Edit3,
} from "lucide-react";
import { Menu, MenuCategory, CreateOrderData, Order } from "@/lib/types";
import { cn } from "@/lib/utils";

// Category display configuration
const categoryConfig = {
  APPETIZER: { label: "Appetizers", color: "bg-orange-100 text-orange-800", icon: "🥗" },
  MAIN_COURSE: { label: "Main Course", color: "bg-red-100 text-red-800", icon: "🍽️" },
  DESSERT: { label: "Desserts", color: "bg-pink-100 text-pink-800", icon: "🍰" },
  BEVERAGE: { label: "Beverages", color: "bg-blue-100 text-blue-800", icon: "🥤" },
  SALAD: { label: "Salads", color: "bg-green-100 text-green-800", icon: "🥬" },
  SOUP: { label: "Soups", color: "bg-yellow-100 text-yellow-800", icon: "🍲" },
  SIDE_DISH: { label: "Sides", color: "bg-gray-100 text-gray-800", icon: "🍟" },
  BREAKFAST: { label: "Breakfast", color: "bg-amber-100 text-amber-800", icon: "🍳" },
  LUNCH: { label: "Lunch", color: "bg-lime-100 text-lime-800", icon: "🥪" },
  DINNER: { label: "Dinner", color: "bg-purple-100 text-purple-800", icon: "🍖" },
  SNACK: { label: "Snacks", color: "bg-teal-100 text-teal-800", icon: "🍿" },
};

function CategoryBadge({ category }: { category: MenuCategory }) {
  const config = categoryConfig[category];
  return (
    <Badge className={cn(config.color, "flex items-center gap-1")}>
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  );
}

function MenuItemCard({ 
  menuItem, 
  onAddToCart,
  onQuickAdd,
  isInCart,
  cartQuantity = 0
}: { 
  menuItem: Menu; 
  onAddToCart: (item: Menu, quantity: number, specialInstructions?: string) => void;
  onQuickAdd: (item: Menu) => void;
  isInCart: boolean;
  cartQuantity?: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(menuItem.id));
  }, [menuItem.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== menuItem.id);
    } else {
      newFavorites = [...favorites, menuItem.id];
    }
    
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    onAddToCart(menuItem, quantity, specialInstructions);
    setShowDetails(false);
    setQuantity(1);
    setSpecialInstructions("");
  };

  return (
    <>
      <Card className={cn(
        "h-full transition-all duration-200 hover:shadow-lg group cursor-pointer",
        !menuItem.isAvailable && "opacity-60 grayscale"
      )}>
        <CardContent className="p-0">
          <div className="relative">
            {menuItem.imageUrl ? (
              <img
                src={menuItem.imageUrl}
                alt={menuItem.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                <Utensils className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite();
              }}
              className={cn(
                "absolute top-2 right-2 p-2 rounded-full transition-all duration-200",
                isFavorite 
                  ? "bg-red-500 text-white" 
                  : "bg-white/80 text-gray-600 hover:bg-white"
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </button>

            {/* Featured badge */}
            {menuItem.isFeatured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                ⭐ Featured
              </Badge>
            )}

            {/* Unavailable overlay */}
            {!menuItem.isAvailable && (
              <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                <Badge variant="destructive" className="text-white">
                  Currently Unavailable
                </Badge>
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-lg leading-tight">{menuItem.name}</h3>
                <CategoryBadge category={menuItem.category} />
              </div>
              
              {menuItem.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{menuItem.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-green-600">
                  ${menuItem.price.toFixed(2)}
                </span>
                
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {menuItem.preparationTimeMinutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {menuItem.preparationTimeMinutes}m
                    </div>
                  )}
                  {menuItem.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {menuItem.rating.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dietary tags */}
              {menuItem.dietaryTags && menuItem.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {menuItem.dietaryTags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {menuItem.spiceLevel && (
                <div className="text-sm flex items-center gap-1">
                  <span>🌶️</span>
                  <span className="capitalize">{menuItem.spiceLevel} spice</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              {isInCart ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {cartQuantity} in cart
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  disabled={!menuItem.isAvailable}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Customize
                </Button>
              )}
              
              <Button
                onClick={() => onQuickAdd(menuItem)}
                disabled={!menuItem.isAvailable}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{menuItem.name}</DialogTitle>
            <DialogDescription>
              Customize your order
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {menuItem.imageUrl && (
              <img
                src={menuItem.imageUrl}
                alt={menuItem.name}
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
            
            <div>
              <p className="text-sm text-gray-600 mb-2">{menuItem.description}</p>
              <p className="text-lg font-semibold text-green-600">
                ${menuItem.price.toFixed(2)}
              </p>
            </div>
            
            <div>
              <Label>Quantity</Label>
              <div className="flex items-center gap-3 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g., No onions, extra spicy, well done..."
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold text-green-600">
                  ${(menuItem.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700">
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CartSummary({ 
  isOpen, 
  onClose, 
  onCheckout 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onCheckout: () => void;
}) {
  const { 
    cartItems, 
    updateCartItemByIndex, 
    removeCartItemByIndex, 
    getCartTotal, 
    getCartItemCount 
  } = useCart();
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editInstructions, setEditInstructions] = useState("");

  const handleEditInstructions = (index: number, currentInstructions?: string) => {
    setEditingItem(index);
    setEditInstructions(currentInstructions || "");
  };

  const saveInstructions = (index: number, quantity: number) => {
    updateCartItemByIndex(index, quantity, editInstructions);
    setEditingItem(null);
    setEditInstructions("");
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Order ({getCartItemCount()} items)
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
              {cartItems.map((item, index) => (
                <div key={`${item.menuItem.id}-${index}-${item.specialInstructions || 'no-instructions'}`} className="bg-white border rounded-lg p-4 space-y-3">
                  <div className="flex gap-3">
                    {item.menuItem.imageUrl && (
                      <img
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-lg">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-600">
                        ${item.menuItem.price.toFixed(2)} each
                      </p>
                      {item.specialInstructions && (
                        <p className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartItemByIndex(index, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartItemByIndex(index, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditInstructions(index, item.specialInstructions)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCartItemByIndex(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {editingItem === index && (
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-sm">Special Instructions</Label>
                      <Textarea
                        value={editInstructions}
                        onChange={(e) => setEditInstructions(e.target.value)}
                        placeholder="Add special instructions..."
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveInstructions(index, item.quantity)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
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
            Continue Shopping
          </Button>
          {cartItems.length > 0 && (
            <Button onClick={onCheckout} className="bg-green-600 hover:bg-green-700">
              Proceed to Checkout
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CheckoutDialog({ 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: (customerData: { name: string; phone: string; email?: string; instructions?: string }) => void;
  isLoading: boolean;
}) {
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    instructions: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { getCartTotal, getCartItemCount } = useCart();

  // Load saved customer data
  useEffect(() => {
    const savedData = localStorage.getItem("customerData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCustomerData(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!customerData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(customerData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (customerData.email && !/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Save customer data for future orders
    localStorage.setItem("customerData", JSON.stringify({
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
    }));
    
    onSubmit(customerData);
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Almost there!</DialogTitle>
          <DialogDescription>
            Just a few details to complete your order
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Summary */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Order Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>{getCartItemCount()} items</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-green-900 border-t pt-1">
                <span>Total</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className={cn("pl-10", errors.name && "border-red-500")}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className={cn("pl-10", errors.phone && "border-red-500")}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.phone}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className={cn("pl-10", errors.email && "border-red-500")}
                  placeholder="Enter your email (optional)"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                We&apos;ll send you order updates if provided
              </p>
            </div>
            
            <div>
              <Label htmlFor="instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                value={customerData.instructions}
                onChange={(e) => setCustomerData({ ...customerData, instructions: e.target.value })}
                rows={3}
                placeholder="Any special requests for your entire order..."
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Back to Cart
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order • ${total.toFixed(2)}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function OrderSuccessDialog({ 
  isOpen, 
  order,
  onClose 
}: { 
  isOpen: boolean; 
  order: Order | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Order Placed Successfully!
          </DialogTitle>
          <DialogDescription>
            Your order has been received and is being prepared
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span className="font-mono text-sm">{order?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Table:</span>
              <span>{order?.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-semibold text-green-600">
                ${order?.totalAmount?.toFixed(2)}
              </span>
            </div>
            {order?.estimatedReadyTime && (
              <div className="flex justify-between">
                <span className="font-medium">Estimated ready time:</span>
                <span className="font-medium">
                  {new Date(order.estimatedReadyTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
          
          <div className="text-center space-y-2">
                         <p className="text-sm text-gray-600">
               🍽️ Your delicious meal is being prepared with care
             </p>
             <p className="text-sm text-gray-600">
               We&apos;ll notify our staff when your order is ready for pickup
             </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 w-full">
            Continue Browsing Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CustomerOrderPage() {
  const searchParams = useSearchParams();
  const tableIdParam = searchParams.get("tableId");
  const tableNumberParam = searchParams.get("table");
  
  // We need the actual UUID, not the table number
  const tableId = tableIdParam; // Only use UUID if available
  
  const { menuItems, isLoading: isLoadingMenu } = usePublicMenu();
  const { 
    cartItems, 
    addToCart, 
    getCartTotal, 
    getCartItemCount, 
    clearCart,
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

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);



  // Filter and search menu items
  const filteredMenuItems = useMemo(() => {
    let items = menuItems.filter(item => item.isAvailable);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.dietaryTags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategory === "favorites") {
      items = items.filter(item => favorites.includes(item.id));
    } else if (selectedCategory !== "all") {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    return items;
  }, [menuItems, searchQuery, selectedCategory, favorites]);

  // Get available categories
  const availableCategories = useMemo(() => {
    return Array.from(new Set(menuItems.filter(item => item.isAvailable).map(item => item.category)));
  }, [menuItems]);

  const handleQuickAdd = (menuItem: Menu) => {
    addToCart(menuItem, 1);
    showToast({
      message: `${menuItem.name} added to cart!`,
      type: "success",
      duration: 2000,
    });
  };

  const handleAddToCart = (menuItem: Menu, quantity: number, specialInstructions?: string) => {
    addToCart(menuItem, quantity, specialInstructions);
    showToast({
      message: `${quantity}x ${menuItem.name} added to cart!`,
      type: "success",
      duration: 2000,
    });
  };

  const handleCheckout = async (customerData: { 
    name: string; 
    phone: string; 
    email?: string; 
    instructions?: string; 
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
              onClick={() => setIsCartOpen(true)}
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
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search menu items, categories, or dietary preferences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="whitespace-nowrap"
              size="sm"
            >
              All Items
            </Button>
            <Button
              variant={selectedCategory === "favorites" ? "default" : "outline"}
              onClick={() => setSelectedCategory("favorites")}
              className="whitespace-nowrap"
              size="sm"
            >
              <Heart className="h-4 w-4 mr-1" />
              Favorites ({favorites.length})
            </Button>
            {availableCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
                size="sm"
              >
                <span className="mr-1">{categoryConfig[category]?.icon}</span>
                {categoryConfig[category]?.label || category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {searchQuery && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
                             {filteredMenuItems.length} result{filteredMenuItems.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenuItems.map((menuItem) => {
            const isInCart = cartItems.some(item => item.menuItem.id === menuItem.id);
            const totalQuantity = cartItems
              .filter(item => item.menuItem.id === menuItem.id)
              .reduce((total, item) => total + item.quantity, 0);
            
            return (
              <MenuItemCard
                key={menuItem.id}
                menuItem={menuItem}
                onAddToCart={handleAddToCart}
                onQuickAdd={handleQuickAdd}
                isInCart={isInCart}
                cartQuantity={totalQuantity}
              />
            );
          })}
        </div>
        
        {filteredMenuItems.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            {searchQuery ? (
              <>
                <p className="text-gray-500 text-lg mb-2">No items found</p>
                <p className="text-gray-400">Try adjusting your search or browse all categories</p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
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
        )}
      </div>

      {/* Fixed Cart Button for Mobile */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-4 right-4 md:hidden z-50">
          <Button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-green-600 hover:bg-green-700 shadow-lg h-14 px-6 rounded-full"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">${getCartTotal().toFixed(2)}</span>
              <span className="text-xs opacity-90">{getCartItemCount()} items</span>
            </div>
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
              {getCartItemCount()}
            </Badge>
          </Button>
        </div>
      )}

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
  );
} 