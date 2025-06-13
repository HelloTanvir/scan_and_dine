import { cn } from '@/lib/utils';
import { UserStatus } from '@/lib/types/user';

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Active',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  INACTIVE: {
    label: 'Inactive',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  SUSPENDED: {
    label: 'Suspended',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
} as const;

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
} 