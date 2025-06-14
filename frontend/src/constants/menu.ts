import { MenuCategory } from "@/lib/types";

export const categoryConfig: Record<MenuCategory, { label: string; color: string; icon: string }> = {
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