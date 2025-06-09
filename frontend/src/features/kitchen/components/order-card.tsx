import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge } from '@/components/common/status-badge';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Order } from '@/lib/types';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: () => void;
  actionLabel: string;
  actionIcon: React.ReactNode;
  isUpdating?: boolean;
}

export const OrderCard = React.memo(function OrderCard({
  order,
  onUpdateStatus,
  actionLabel,
  actionIcon,
  isUpdating = false,
}: OrderCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{order.id}</CardTitle>
          <PriorityBadge priority={order.priority} />
        </div>
        <CardDescription>
          Table {order.tableNumber} • {order.time}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
                {item.special && (
                  <span className="text-orange-600 ml-1">({item.special})</span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <StatusBadge status={order.status} />
          <Button
            onClick={onUpdateStatus}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isUpdating ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : null}
            {actionLabel}
            {!isUpdating && actionIcon}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}); 