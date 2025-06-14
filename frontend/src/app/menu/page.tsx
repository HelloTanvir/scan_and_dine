"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  useMenuManagement,
  useMenuFilters,
} from "@/features/menu/hooks/use-menu";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  DollarSign,
  Tag,
  Image,
} from "lucide-react";
import {
  Menu,
  CreateMenuData,
  UpdateMenuData,
  MenuCategory,
} from "@/lib/types";

// Category display configuration
const categoryConfig = {
  APPETIZER: { label: "Appetizer", color: "bg-orange-100 text-orange-800" },
  MAIN_COURSE: { label: "Main Course", color: "bg-red-100 text-red-800" },
  DESSERT: { label: "Dessert", color: "bg-pink-100 text-pink-800" },
  BEVERAGE: { label: "Beverage", color: "bg-blue-100 text-blue-800" },
  SALAD: { label: "Salad", color: "bg-green-100 text-green-800" },
  SOUP: { label: "Soup", color: "bg-yellow-100 text-yellow-800" },
  SIDE_DISH: { label: "Side Dish", color: "bg-gray-100 text-gray-800" },
  BREAKFAST: { label: "Breakfast", color: "bg-amber-100 text-amber-800" },
  LUNCH: { label: "Lunch", color: "bg-lime-100 text-lime-800" },
  DINNER: { label: "Dinner", color: "bg-purple-100 text-purple-800" },
  SNACK: { label: "Snack", color: "bg-teal-100 text-teal-800" },
};

function CategoryBadge({ category }: { category: MenuCategory }) {
  const config = categoryConfig[category];
  return (
    <Badge className={config.color}>
      {config.label}
    </Badge>
  );
}

function AvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  return (
    <Badge className={isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
      {isAvailable ? "Available" : "Unavailable"}
    </Badge>
  );
}

// Menu item form dialog
function MenuItemFormDialog({
  menuItem,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: Readonly<{
  menuItem?: Menu;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMenuData | UpdateMenuData) => Promise<void>;
  isLoading: boolean;
}>) {
  const [formData, setFormData] = useState<CreateMenuData>({
    name: "",
    description: "",
    price: 0,
    category: "MAIN_COURSE",
    imageUrl: "",
    isAvailable: true,
    isFeatured: false,
    ingredients: [],
    allergens: [],
    dietaryTags: [],
    preparationTimeMinutes: undefined,
    calories: undefined,
    spiceLevel: undefined,
  });

  const [ingredientsInput, setIngredientsInput] = useState("");
  const [allergensInput, setAllergensInput] = useState("");
  const [dietaryTagsInput, setDietaryTagsInput] = useState("");

  // Reset form when dialog opens/closes or menuItem changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: menuItem?.name || "",
        description: menuItem?.description || "",
        price: menuItem?.price || 0,
        category: menuItem?.category || "MAIN_COURSE",
        imageUrl: menuItem?.imageUrl || "",
        isAvailable: menuItem?.isAvailable ?? true,
        isFeatured: menuItem?.isFeatured ?? false,
        ingredients: menuItem?.ingredients || [],
        allergens: menuItem?.allergens || [],
        dietaryTags: menuItem?.dietaryTags || [],
        preparationTimeMinutes: menuItem?.preparationTimeMinutes || undefined,
        calories: menuItem?.calories || undefined,
        spiceLevel: menuItem?.spiceLevel || undefined,
      });
      setIngredientsInput(menuItem?.ingredients?.join(", ") || "");
      setAllergensInput(menuItem?.allergens?.join(", ") || "");
      setDietaryTagsInput(menuItem?.dietaryTags?.join(", ") || "");
    }
  }, [isOpen, menuItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalData = {
      ...formData,
      ingredients: ingredientsInput ? ingredientsInput.split(",").map(item => item.trim()) : [],
      allergens: allergensInput ? allergensInput.split(",").map(item => item.trim()) : [],
      dietaryTags: dietaryTagsInput ? dietaryTagsInput.split(",").map(item => item.trim()) : [],
      spiceLevel: formData.spiceLevel === "None" ? undefined : formData.spiceLevel,
    };
    
    await onSubmit(finalData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{menuItem ? "Edit Menu Item" : "Create New Menu Item"}</DialogTitle>
          <DialogDescription>
            {menuItem
              ? "Update menu item information"
              : "Add a new item to your menu"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: MenuCategory) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prepTime">Prep Time (minutes)</Label>
              <Input
                id="prepTime"
                type="number"
                min="1"
                value={formData.preparationTimeMinutes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparationTimeMinutes: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                min="1"
                value={formData.calories || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    calories: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="spiceLevel">Spice Level</Label>
            <Select
              value={formData.spiceLevel || "None"}
              onValueChange={(value) =>
                setFormData({ ...formData, spiceLevel: value === "None" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select spice level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Mild">Mild</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Very Hot">Very Hot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
            <Input
              id="ingredients"
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              placeholder="Tomato, Lettuce, Cheese, etc."
            />
          </div>

          <div>
            <Label htmlFor="allergens">Allergens (comma-separated)</Label>
            <Input
              id="allergens"
              value={allergensInput}
              onChange={(e) => setAllergensInput(e.target.value)}
              placeholder="Gluten, Dairy, Nuts, etc."
            />
          </div>

          <div>
            <Label htmlFor="dietaryTags">Dietary Tags (comma-separated)</Label>
            <Input
              id="dietaryTags"
              value={dietaryTagsInput}
              onChange={(e) => setDietaryTagsInput(e.target.value)}
              placeholder="Vegetarian, Vegan, Gluten-Free, etc."
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isAvailable: checked })
                }
              />
              <Label htmlFor="isAvailable">Available</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isFeatured: checked })
                }
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              {menuItem ? "Update" : "Create"} Menu Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MenuContent() {
  const {
    menuItems,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreateMenuItem,
    handleUpdateMenuItem,
    handleUpdateAvailability,
    handleUpdateFeaturedStatus,
    handleDeleteMenuItem,
  } = useMenuManagement();

  const {
    filteredMenuItems,
    categoryFilter,
    setCategoryFilter,
    availabilityFilter,
    setAvailabilityFilter,
    featuredFilter,
    setFeaturedFilter,
    availableCategories,
  } = useMenuFilters(menuItems);

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<Menu | null>(null);

  const displayMenuItems = searchQuery
    ? filteredMenuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredMenuItems;

  const handleCreateSubmit = async (data: CreateMenuData | UpdateMenuData) => {
    await handleCreateMenuItem(data as CreateMenuData);
  };

  const handleUpdateSubmit = async (data: CreateMenuData | UpdateMenuData) => {
    if (editingMenuItem) {
      await handleUpdateMenuItem(editingMenuItem.id, data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Failed to load menu items: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-900">Menu Management</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select
                value={categoryFilter}
                onValueChange={(value: MenuCategory | "all") => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryConfig[category]?.label || category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <Select
                value={availabilityFilter}
                onValueChange={(value: "all" | "available" | "unavailable") => setAvailabilityFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-500" />
              <Select
                value={featuredFilter}
                onValueChange={(value: "all" | "featured" | "not-featured") => setFeaturedFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="not-featured">Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Items ({displayMenuItems.length})</CardTitle>
          <CardDescription>Manage your restaurant menu items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayMenuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={item.category} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {item.price.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <AvailabilityBadge isAvailable={item.isAvailable} />
                      {item.isFeatured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      {item.preparationTimeMinutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.preparationTimeMinutes}m
                        </div>
                      )}
                      {item.calories && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.calories} cal
                        </div>
                      )}
                      {item.spiceLevel && (
                        <div className="text-xs text-gray-500">
                          🌶️ {item.spiceLevel}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingMenuItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={(checked) =>
                          handleUpdateAvailability(item.id, checked)
                        }
                      />
                      <Switch
                        checked={item.isFeatured}
                        onCheckedChange={(checked) =>
                          handleUpdateFeaturedStatus(item.id, checked)
                        }
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteMenuItem(item.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <MenuItemFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />

      <MenuItemFormDialog
        menuItem={editingMenuItem || undefined}
        isOpen={!!editingMenuItem}
        onClose={() => setEditingMenuItem(null)}
        onSubmit={handleUpdateSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <ProtectedRoute requiredRoles={["ADMIN", "MANAGER"]}>
      <DashboardLayout>
        <ErrorBoundary>
          <MenuContent />
        </ErrorBoundary>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 