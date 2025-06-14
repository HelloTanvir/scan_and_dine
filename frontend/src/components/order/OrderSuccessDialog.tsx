import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { Order } from "@/lib/types";

interface OrderSuccessDialogProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export function OrderSuccessDialog({ 
  isOpen, 
  order,
  onClose 
}: OrderSuccessDialogProps) {
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