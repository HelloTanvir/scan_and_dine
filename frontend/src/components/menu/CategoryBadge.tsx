import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MenuCategory } from "@/lib/types";
import { categoryConfig } from "@/constants/menu";

interface CategoryBadgeProps {
  category: MenuCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  
  return (
    <Badge className={cn(config.color, "flex items-center gap-1")}>
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  );
} 