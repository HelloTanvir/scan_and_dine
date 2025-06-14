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
  CreditCard,
  Calendar,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/order/hooks/use-order";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: { 
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
  }) => void;
  isLoading: boolean;
}

export function CheckoutDialog({ 
  isOpen, 
  onClose, 
  onSubmit 
}: CheckoutDialogProps) {
  const [currentStep, setCurrentStep] = useState<'customer' | 'payment' | 'processing'>('customer');
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    instructions: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const { getCartTotal, getCartItemCount, refreshCart } = useCart();

  useEffect(() => {
    const savedData = localStorage.getItem("customerData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCustomerData(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshCart();
      setCurrentStep('customer');
      setPaymentProcessing(false);
    }
  }, [isOpen]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCustomerForm = () => {
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

  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!paymentData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = "Card number is required";
    } else if (paymentData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = "Please enter a valid card number";
    }
    
    if (!paymentData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    } else {
      const [month, year] = paymentData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = "Please enter a valid month (01-12)";
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = "Card has expired";
      }
    }
    
    if (!paymentData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = "Please enter a valid CVV";
    }
    
    if (!paymentData.cardName.trim()) {
      newErrors.cardName = "Name on card is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCustomerForm()) return;
    
    localStorage.setItem("customerData", JSON.stringify({
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
    }));
    
    setCurrentStep('payment');
  };

  const simulatePaymentProcessing = async () => {
    setPaymentProcessing(true);
    setCurrentStep('processing');
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate payment success/failure (90% success rate for demo)
    const paymentSuccess = Math.random() > 0.1;
    
    if (paymentSuccess) {
      onSubmit({
        ...customerData,
        paymentData,
      });
    } else {
      setErrors({ payment: "Payment failed. Please try again." });
      setCurrentStep('payment');
    }
    
    setPaymentProcessing(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) return;
    
    simulatePaymentProcessing();
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const renderCustomerStep = () => (
    <form onSubmit={handleCustomerSubmit} className="space-y-4">
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
        <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          Continue to Payment
        </Button>
      </DialogFooter>
    </form>
  );

  const renderPaymentStep = () => (
    <form onSubmit={handlePaymentSubmit} className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Payment Details</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Order Total</span>
            <span className="font-semibold text-blue-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {errors.payment && (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {errors.payment}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number *</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="cardNumber"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({ 
                ...paymentData, 
                cardNumber: formatCardNumber(e.target.value) 
              })}
              className={cn("pl-10", errors.cardNumber && "border-red-500")}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>
          {errors.cardNumber && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.cardNumber}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="cardName">Name on Card *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="cardName"
              value={paymentData.cardName}
              onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
              className={cn("pl-10", errors.cardName && "border-red-500")}
              placeholder="John Doe"
            />
          </div>
          {errors.cardName && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.cardName}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="expiryDate"
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData({ 
                  ...paymentData, 
                  expiryDate: formatExpiryDate(e.target.value) 
                })}
                className={cn("pl-10", errors.expiryDate && "border-red-500")}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            {errors.expiryDate && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.expiryDate}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="cvv">CVV *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="cvv"
                type="password"
                value={paymentData.cvv}
                onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })}
                className={cn("pl-10", errors.cvv && "border-red-500")}
                placeholder="123"
                maxLength={4}
              />
            </div>
            {errors.cvv && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.cvv}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <Lock className="h-3 w-3" />
          This is a demo payment system. No real charges will be made.
        </p>
      </div>
      
      <DialogFooter className="flex-col sm:flex-row gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setCurrentStep('customer')} 
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={paymentProcessing}
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          {paymentProcessing ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            <>
              Pay ${total.toFixed(2)}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <div className="mb-4">
        <LoadingSpinner size="lg" className="mx-auto" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Processing Your Payment</h3>
      <p className="text-gray-600">Please wait while we securely process your payment...</p>
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          💳 Processing payment of ${total.toFixed(2)}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'customer' && "Customer Information"}
            {currentStep === 'payment' && "Payment Details"}
            {currentStep === 'processing' && "Processing Payment"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'customer' && "Please provide your contact information"}
            {currentStep === 'payment' && "Enter your payment details to complete the order"}
            {currentStep === 'processing' && "Your payment is being processed securely"}
          </DialogDescription>
        </DialogHeader>
        
        {currentStep === 'customer' && renderCustomerStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'processing' && renderProcessingStep()}
      </DialogContent>
    </Dialog>
  );
} 