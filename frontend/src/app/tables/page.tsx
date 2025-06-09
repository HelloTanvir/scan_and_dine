"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from '@/components/common/error-boundary';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useTablesManagement, useReservations, usePayments, useTableOrders, useTableFilters } from '@/features/tables/hooks/use-tables';
import { 
  Download, 
  Printer, 
  QrCode, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Clock,
  MapPin,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Table as TableType, CreateTableData, UpdateTableData, TableStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

// Simple Badge component
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', className)}>
      {children}
    </span>
  );
}

// Status badge component
function StatusBadge({ status }: { status: TableType['status'] }) {
  const statusConfig = {
    available: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    occupied: { color: 'bg-red-100 text-red-800', icon: Users },
    reserved: { color: 'bg-blue-100 text-blue-800', icon: Clock },
    cleaning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    maintenance: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// QR Code preview component
function QRCodePreview({ qrCodeData, tableName }: { qrCodeData: string | null; tableName: string }) {
  if (!qrCodeData) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Select a table to generate QR code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="bg-white p-4 rounded-lg border inline-block">
        <div className="text-lg font-semibold text-green-900 mb-2">Scan & Dine</div>
        <div className="text-md mb-3">{tableName}</div>
        <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
          <QrCode className="h-24 w-24 text-green-600" />
        </div>
        <div className="text-xs text-gray-600 mt-3 max-w-48">
          Scan this QR code to view our menu and place your order
        </div>
      </div>
    </div>
  );
}

// Create/Edit table dialog
function TableFormDialog({ 
  table, 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading 
}: { 
  table?: TableType; 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: CreateTableData | UpdateTableData) => Promise<void>; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<CreateTableData>({
    number: table?.number || '',
    capacity: table?.capacity || 2,
    location: table?.location || '',
    features: table?.features || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{table ? 'Edit Table' : 'Create New Table'}</DialogTitle>
          <DialogDescription>
            {table ? 'Update table information' : 'Add a new table to your restaurant'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number">Table Number</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="20"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Select value={formData.location || ''} onValueChange={(value) => setFormData({ ...formData, location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Window">Window</SelectItem>
                <SelectItem value="Corner">Corner</SelectItem>
                <SelectItem value="Center">Center</SelectItem>
                <SelectItem value="Patio">Patio</SelectItem>
                <SelectItem value="Private Room">Private Room</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              {table ? 'Update' : 'Create'} Table
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Table details dialog
function TableDetailsDialog({ 
  table, 
  isOpen, 
  onClose 
}: { 
  table: TableType | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { data: reservations } = useReservations(table?.id);
  const { data: payments } = usePayments(table?.id);
  const { data: orders } = useTableOrders(table?.id || '');

  if (!table) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Table {table.number} Details</DialogTitle>
          <DialogDescription>
            Complete information about this table
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <StatusBadge status={table.status} />
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {table.capacity} seats
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {table.location || 'Not specified'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Current Customers</Label>
                <div>{table.currentCustomers || 0}</div>
              </div>
            </div>
            
            {table.sessionStartTime && (
              <div className="space-y-2">
                <Label>Session Info</Label>
                <div className="text-sm text-gray-600">
                  Started: {new Date(table.sessionStartTime).toLocaleString()}
                  {table.totalSessionAmount && (
                    <div>Amount: ${table.totalSessionAmount}</div>
                  )}
                </div>
              </div>
            )}
            
            {table.features && table.features.length > 0 && (
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex flex-wrap gap-2">
                  {table.features.map((feature, index) => (
                    <Badge key={index} className="bg-gray-100 text-gray-800">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            {orders && orders.length > 0 ? (
              <div className="space-y-2">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-gray-600">
                            {order.items.length} items • ${order.total}
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 mt-1">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.time}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No orders for this table
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reservations" className="space-y-4">
            {reservations && reservations.length > 0 ? (
              <div className="space-y-2">
                {reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{reservation.customerName}</div>
                          <div className="text-sm text-gray-600">
                            {reservation.partySize} guests • {reservation.reservationTime}
                          </div>
                          <Badge className="bg-green-100 text-green-800 mt-1">
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(reservation.reservationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reservations for this table
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            {payments && payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">${payment.amount}</div>
                          <div className="text-sm text-gray-600">
                            {payment.method} • {payment.orderId}
                          </div>
                          <Badge className="bg-purple-100 text-purple-800 mt-1">
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Pending'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No payments for this table
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function TablesContent() {
  const {
    tables,
    isLoading,
    error,
    selectedTable,
    qrCodeData,
    isGenerating,
    generatingTableId,
    isDownloading,
    handleGenerateQR,
    handleDownload,
    handlePrint,
    handleStatusUpdate,
    handleCreateTable,
    handleUpdateTable,
    handleDeleteTable,
    isCreating,
    isCrudUpdating,
    isDeleting,
    isUpdating,
    updatingTableId,
  } = useTablesManagement();

  const { filteredTables, statusFilter, setStatusFilter, availableLocations, locationFilter, setLocationFilter } = useTableFilters(tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableType | null>(null);
  const [viewingTable, setViewingTable] = useState<TableType | null>(null);

  const selectedTableData = tables.find(t => t.id === selectedTable);

  const displayTables = searchQuery 
    ? filteredTables.filter(table => 
        table.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTables;

  const handleCreateSubmit = async (data: CreateTableData | UpdateTableData) => {
    await handleCreateTable(data as CreateTableData);
  };

  const handleUpdateSubmit = async (data: CreateTableData | UpdateTableData) => {
    if (editingTable) {
      await handleUpdateTable(editingTable.id, data);
    }
  };

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
        <p className="text-red-500">Failed to load tables: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-900">Tables Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={(value: TableStatus) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <Select value={locationFilter || 'all'} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {availableLocations.filter((location): location is string => Boolean(location)).map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tables List */}
        <Card>
          <CardHeader>
            <CardTitle>Tables ({displayTables.length})</CardTitle>
            <CardDescription>Manage your restaurant tables</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">Table {table.number}</div>
                        {table.location && (
                          <div className="text-sm text-gray-500">{table.location}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={table.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {table.capacity}
                        {table.currentCustomers && (
                          <span className="text-sm text-gray-500">
                            ({table.currentCustomers} seated)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingTable(table)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleGenerateQR(table.id)}
                          disabled={isGenerating}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isGenerating && generatingTableId === table.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <QrCode className="h-4 w-4" />
                          )}
                        </Button>
                        <Select
                          value={table.status}
                          onValueChange={(status: TableType['status']) => handleStatusUpdate(table.id, status)}
                          disabled={isUpdating && updatingTableId === table.id}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTable(table)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTable(table.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Preview</CardTitle>
            <CardDescription>
              {selectedTableData 
                ? `QR code for Table ${selectedTableData.number}` 
                : 'Generate a QR code to preview it here'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodePreview 
              qrCodeData={qrCodeData} 
              tableName={selectedTableData ? `Table ${selectedTableData.number}` : ''} 
            />
            
            {qrCodeData && (
              <div className="flex gap-2 justify-center mt-4">
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  variant="outline"
                >
                  {isDownloading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <TableFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />

      <TableFormDialog
        table={editingTable || undefined}
        isOpen={!!editingTable}
        onClose={() => setEditingTable(null)}
        onSubmit={handleUpdateSubmit}
        isLoading={isCrudUpdating}
      />

      <TableDetailsDialog
        table={viewingTable}
        isOpen={!!viewingTable}
        onClose={() => setViewingTable(null)}
      />
    </div>
  );
}

export default function TablesPage() {
  return (
    <DashboardLayout>
      <ErrorBoundary>
        <TablesContent />
      </ErrorBoundary>
    </DashboardLayout>
  );
}
