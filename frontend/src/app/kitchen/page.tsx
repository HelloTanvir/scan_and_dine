"use client";

import React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from '@/components/common/error-boundary';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { StatsCard } from '@/features/dashboard/components/stats-card';
import { OrderCard } from '@/features/kitchen/components/order-card';
import { useKitchenManagement } from '@/features/kitchen/hooks/use-kitchen';
import { Order } from '@/lib/types';
import { Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

function KitchenStats({ orders }: { orders: Order[] }) {
  const getOrderCount = (status: string) => 
    orders.filter(order => order.status === status).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Pending Orders"
        value={getOrderCount("pending")}
        icon={Clock}
      />
      <StatsCard
        title="Preparing"
        value={getOrderCount("preparing")}
        icon={AlertCircle}
      />
      <StatsCard
        title="Ready to Serve"
        value={getOrderCount("ready")}
        icon={CheckCircle2}
      />
    </div>
  );
}

function OrdersGrid({ 
  orders, 
  onUpdateStatus, 
  actionLabel, 
  actionIcon, 
  isUpdating,
  updatingOrderId
}: {
  orders: Order[];
  onUpdateStatus: (orderId: string) => void;
  actionLabel: string;
  actionIcon: React.ReactNode;
  isUpdating: boolean;
  updatingOrderId: string | null;
}) {
  if (orders.length === 0) {
    return (
      <div className="col-span-full text-center p-8 border rounded-lg border-dashed">
        <p className="text-gray-500">No orders at the moment</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onUpdateStatus={() => onUpdateStatus(order.id)}
          actionLabel={actionLabel}
          actionIcon={actionIcon}
          isUpdating={isUpdating && updatingOrderId === order.id}
        />
      ))}
    </div>
  );
}

function KitchenContent() {
  const {
    orders,
    isLoading,
    error,
    handleUpdateStatus,
    isUpdating,
    updatingOrderId,
    getFilteredOrders
  } = useKitchenManagement();

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
        <p className="text-red-500">Failed to load kitchen orders</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-green-900">Kitchen Dashboard</h1>

      <KitchenStats orders={orders} />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-green-100">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready to Serve</TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="pt-4">
          <OrdersGrid
            orders={getFilteredOrders("pending")}
            onUpdateStatus={(orderId) => handleUpdateStatus(orderId, "preparing")}
            actionLabel="Start Preparing"
            actionIcon={<ArrowRight className="h-4 w-4 ml-2" />}
            isUpdating={isUpdating}
            updatingOrderId={updatingOrderId}
          />
        </TabsContent>

        <TabsContent value="preparing" className="pt-4">
          <OrdersGrid
            orders={getFilteredOrders("preparing")}
            onUpdateStatus={(orderId) => handleUpdateStatus(orderId, "ready")}
            actionLabel="Mark as Ready"
            actionIcon={<CheckCircle2 className="h-4 w-4 ml-2" />}
            isUpdating={isUpdating}
            updatingOrderId={updatingOrderId}
          />
        </TabsContent>

        <TabsContent value="ready" className="pt-4">
          <OrdersGrid
            orders={getFilteredOrders("ready")}
            onUpdateStatus={(orderId) => handleUpdateStatus(orderId, "completed")}
            actionLabel="Complete Order"
            actionIcon={<CheckCircle2 className="h-4 w-4 ml-2" />}
            isUpdating={isUpdating}
            updatingOrderId={updatingOrderId}
          />
        </TabsContent>

        <TabsContent value="all" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <Card key={order.id} className="h-full">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                      <span className="text-sm text-gray-500">Table {order.tableNumber}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.length} items • {order.time}
                    </div>
                    <div className="text-sm">
                      Status: <span className="font-medium">{order.status}</span>
                    </div>
                    <div className="text-sm font-medium">
                      Total: ${order.total.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function KitchenPage() {
  return (
    <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'STAFF']}>
      <DashboardLayout>
        <ErrorBoundary>
          <KitchenContent />
        </ErrorBoundary>
      </DashboardLayout>
    </ProtectedRoute>
  );
}