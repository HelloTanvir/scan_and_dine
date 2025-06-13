"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Clock,
  ShoppingCart,
  Phone,
  Utensils,
  Star,
} from "lucide-react";

// Simple Badge component
function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary";
}) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = variant === "secondary" 
    ? "bg-gray-100 text-gray-800" 
    : "bg-green-100 text-green-800";
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${className || ""}`}>
      {children}
    </span>
  );
}

export default function MenuPage() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");
  const sessionId = searchParams.get("session");
  const tableId = searchParams.get("tableId");

  const [deviceInfo, setDeviceInfo] = useState<string>("");

  useEffect(() => {
    // Generate a simple device fingerprint for session tracking
    const generateDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const language = navigator.language;
      const platform = navigator.platform;
      const screenResolution = `${screen.width}x${screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Create a simple hash based on device characteristics
      const deviceString = `${userAgent}-${language}-${platform}-${screenResolution}-${timezone}`;
      const hash = deviceString
        .split("")
        .reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0);
          return a & a;
        }, 0)
        .toString(36);
      
      return hash;
    };

    setDeviceInfo(generateDeviceInfo());
  }, []);

  // Mock menu items - this will be replaced with actual menu data later
  const menuCategories = [
    {
      name: "Appetizers",
      items: [
        {
          id: "1",
          name: "Spring Rolls",
          description: "Fresh vegetables wrapped in crispy pastry",
          price: 8.99,
          rating: 4.5,
          isVegetarian: true,
        },
        {
          id: "2",
          name: "Chicken Wings",
          description: "Crispy wings with buffalo sauce",
          price: 12.99,
          rating: 4.7,
        },
      ],
    },
    {
      name: "Main Courses",
      items: [
        {
          id: "3",
          name: "Grilled Salmon",
          description: "Fresh salmon with lemon herb seasoning",
          price: 24.99,
          rating: 4.8,
        },
        {
          id: "4",
          name: "Beef Burger",
          description: "Juicy beef patty with fresh toppings",
          price: 16.99,
          rating: 4.6,
        },
      ],
    },
    {
      name: "Beverages",
      items: [
        {
          id: "5",
          name: "Fresh Orange Juice",
          description: "Freshly squeezed orange juice",
          price: 4.99,
          rating: 4.3,
        },
        {
          id: "6",
          name: "Coffee",
          description: "Freshly brewed coffee",
          price: 3.99,
          rating: 4.4,
        },
      ],
    },
  ];

  const [cart, setCart] = useState<Array<{ id: string; quantity: number }>>([]);

  const addToCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: itemId, quantity: 1 }];
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => {
      const menuItem = menuCategories
        .flatMap((cat) => cat.items)
        .find((item) => item.id === cartItem.id);
      return total + (menuItem?.price || 0) * cartItem.quantity;
    }, 0);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!tableNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Invalid QR Code
            </h2>
            <p className="text-gray-600">
              This QR code doesn't contain valid table information. Please scan
              a valid table QR code.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Scan & Dine</h1>
              <p className="text-green-100">Digital Menu</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-100">
                <Users className="h-5 w-5" />
                <span>Table {tableNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Info (Debug) */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-blue-50 border border-blue-200 px-4 py-2">
          <div className="max-w-4xl mx-auto text-sm text-blue-700">
            <strong>Debug Info:</strong> Table: {tableNumber} | Session:{" "}
            {sessionId} | Device: {deviceInfo} | Table ID: {tableId}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome Message */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Utensils className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome to Table {tableNumber}!
                </h2>
                <p className="text-gray-600">
                  Browse our menu and place your order directly from your phone.
                  No waiting required!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Categories */}
        <div className="space-y-8">
          {menuCategories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle className="text-green-900">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          {item.isVegetarian && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700"
                            >
                              Vegetarian
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {item.rating}
                            </span>
                          </div>
                          <span className="text-lg font-semibold text-green-600">
                            ${item.price}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => addToCart(item.id)}
                        className="bg-green-600 hover:bg-green-700 ml-4"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        {cartItemsCount > 0 && (
          <Card className="fixed bottom-4 left-4 right-4 mx-auto max-w-4xl shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">
                    {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""} in
                    cart
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-green-600">
                    ${getCartTotal().toFixed(2)}
                  </span>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Place Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <Card className="mt-8 mb-20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                <Phone className="h-4 w-4" />
                <span>Need assistance? Call us at (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Kitchen closes at 10:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 