import React, { useState, useEffect } from "react";
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
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  Phone,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/order/hooks/use-order";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: { name: string; phone: string; email?: string; instructions?: string }) => void;
  isLoading: boolean;
}

export function CheckoutDialog({ 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading 
}: CheckoutDialogProps) {
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    instructions: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { getCartTotal, getCartItemCount } = useCart();

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