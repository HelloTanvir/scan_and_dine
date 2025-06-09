import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  className?: string;
}

export const StatsCard = React.memo(function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  className,
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {change !== undefined && (
              <p
                className={cn(
                  'mt-1 text-xs flex items-center',
                  isPositive && 'text-green-700',
                  isNegative && 'text-red-500'
                )}
              >
                {isPositive && <ArrowUpRight className="h-3 w-3 mr-1" />}
                {isNegative && <ArrowDownRight className="h-3 w-3 mr-1" />}
                <span>
                  {isPositive ? '+' : ''}{change}% from yesterday
                </span>
              </p>
            )}
          </div>
          <div className="rounded-full bg-green-100 p-3">
            <Icon className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}); 