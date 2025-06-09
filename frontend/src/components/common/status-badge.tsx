import { cn } from '@/lib/utils';
import { ORDER_STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import { OrderStatus, OrderPriority } from '@/lib/types';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

interface PriorityBadgeProps {
  priority: OrderPriority;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
} 