import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  Heart,
} from "lucide-react";
import { MenuCategory } from "@/lib/types";
import { categoryConfig } from "@/constants/menu";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: MenuCategory | "all" | "favorites";
  onCategoryChange: (category: MenuCategory | "all" | "favorites") => void;
  availableCategories: MenuCategory[];
  favoritesCount: number;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  availableCategories,
  favoritesCount
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search menu items, categories, or dietary preferences..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => onCategoryChange("all")}
            className="whitespace-nowrap"
            size="sm"
          >
            All Items
          </Button>
          <Button
            variant={selectedCategory === "favorites" ? "default" : "outline"}
            onClick={() => onCategoryChange("favorites")}
            className="whitespace-nowrap"
            size="sm"
          >
            <Heart className="h-4 w-4 mr-1" />
            Favorites ({favoritesCount})
          </Button>
          {availableCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => onCategoryChange(category)}
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
  );
} 