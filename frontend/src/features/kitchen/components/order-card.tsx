import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Order } from '@/lib/types/index';
import { User, Phone } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: () => void;
  actionLabel: string;
  actionIcon: React.ReactNode;
  isUpdating?: boolean;
}

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'served':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getPriorityColor(priority)}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
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
          <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
          <PriorityBadge priority={order.priority} />
        </div>
        <CardDescription>
          Table {order.tableNumber} • {order.time}
          {order.customerName && (
            <div className="flex items-center gap-2 text-sm mt-1">
              <User className="h-3 w-3" />
              <span>{order.customerName}</span>
              {order.customerPhone && (
                <>
                  <Phone className="h-3 w-3 ml-2" />
                  <span>{order.customerPhone}</span>
                </>
              )}
            </div>
          )}
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
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="text-sm p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <strong>Notes:</strong> {order.notes}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="space-y-1">
            <StatusBadge status={order.status} />
            <div className="text-sm font-medium">
              Total: ${order.total.toFixed(2)}
            </div>
          </div>
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