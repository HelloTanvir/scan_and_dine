import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  Clock,
  Star,
  CheckCircle,
  Heart,
  Utensils,
  Edit3,
} from "lucide-react";
import { Menu } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

interface MenuItemCardProps {
  menuItem: Menu;
  onAddToCart: (item: Menu, quantity: number, specialInstructions?: string) => void;
  onQuickAdd: (item: Menu) => void;
  isInCart: boolean;
  cartQuantity?: number;
}

export function MenuItemCard({ 
  menuItem, 
  onAddToCart,
  onQuickAdd,
  isInCart,
  cartQuantity = 0
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

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

            {menuItem.isFeatured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                ⭐ Featured
              </Badge>
            )}

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