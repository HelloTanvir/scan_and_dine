import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types/auth';

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

const ROLE_CONFIG = {
  ADMIN: {
    label: 'Admin',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  MANAGER: {
    label: 'Manager',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  STAFF: {
    label: 'Staff',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
} as const;

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const config = ROLE_CONFIG[role];
  
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