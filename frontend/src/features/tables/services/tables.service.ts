import { 
  Table, 
  Reservation, 
  Payment, 
  TableAnalytics, 
  CreateTableData, 
  UpdateTableData,
  CreateReservationData,
  UpdateReservationData,
  Order
} from '@/lib/types';
import { 
  mockTables, 
  mockReservations, 
  mockPayments, 
  mockTableAnalytics,
  mockOrders 
} from '@/lib/services/mock-data';
import { API_ENDPOINTS } from '@/lib/constants';

export class TablesService {
  private tables: Table[] = [...mockTables];
  private reservations: Reservation[] = [...mockReservations];
  private payments: Payment[] = [...mockPayments];
  private orders: Order[] = [...mockOrders];

  private endpoints = {
    tables: API_ENDPOINTS.TABLES,
    tablesQR: API_ENDPOINTS.TABLES_QR,
    reservations: '/api/reservations',
    payments: '/api/payments',
    analytics: '/api/analytics/tables',
  };

  // Table CRUD operations
  async getTables(): Promise<Table[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // const response = await fetch(this.endpoints.tables);
    // if (!response.ok) throw new Error('Failed to fetch tables');
    // return response.json();
    
    return [...this.tables];
  }

  async getTable(tableId: string): Promise<Table> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // const response = await fetch(`${this.endpoints.tables}/${tableId}`);
    // if (!response.ok) throw new Error('Table not found');
    // return response.json();

    const table = this.tables.find(t => t.id === tableId);
    if (!table) throw new Error('Table not found');
    return table;
  }

  async createTable(tableData: CreateTableData): Promise<Table> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // const response = await fetch(this.endpoints.tables, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(tableData),
    // });
    // if (!response.ok) throw new Error('Failed to create table');
    // return response.json();

    const newTable: Table = {
      ...tableData,
      id: `table-${Date.now()}`,
      status: 'available',
      isOccupied: false,
      qrCode: `qr-table-${Date.now()}`,
      createdAt: new Date(),
      lastCleaned: new Date(),
    };

    this.tables.push(newTable);
    return newTable;
  }

  async updateTable(tableId: string, updates: UpdateTableData): Promise<Table> {
    await new Promise(resolve => setTimeout(resolve, 600));
    // const response = await fetch(`${this.endpoints.tables}/${tableId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates),
    // });
    // if (!response.ok) throw new Error('Failed to update table');
    // return response.json();

    const tableIndex = this.tables.findIndex(t => t.id === tableId);
    if (tableIndex === -1) throw new Error('Table not found');

    this.tables[tableIndex] = { 
      ...this.tables[tableIndex], 
      ...updates,
      updatedAt: new Date()
    };
    return this.tables[tableIndex];
  }

  async deleteTable(tableId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // await fetch(`${this.endpoints.tables}/${tableId}`, {
    //   method: 'DELETE',
    // });

    const tableIndex = this.tables.findIndex(t => t.id === tableId);
    if (tableIndex === -1) throw new Error('Table not found');

    this.tables.splice(tableIndex, 1);
  }

  // Table status management
  async updateTableStatus(tableId: string, status: Table['status']): Promise<Table> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const tableIndex = this.tables.findIndex(t => t.id === tableId);
    if (tableIndex === -1) throw new Error('Table not found');

    this.tables[tableIndex] = {
      ...this.tables[tableIndex],
      status,
      isOccupied: status === 'occupied',
      updatedAt: new Date(),
      ...(status === 'cleaning' && { lastCleaned: new Date() }),
      ...(status === 'occupied' && { sessionStartTime: new Date() }),
      ...(status === 'available' && { 
        currentOrder: undefined,
        currentReservation: undefined,
        currentCustomers: undefined,
        sessionStartTime: undefined,
        totalSessionAmount: undefined
      }),
    };

    return this.tables[tableIndex];
  }

  async seatCustomers(tableId: string, customerCount: number): Promise<Table> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const tableIndex = this.tables.findIndex(t => t.id === tableId);
    if (tableIndex === -1) throw new Error('Table not found');

    this.tables[tableIndex] = {
      ...this.tables[tableIndex],
      status: 'occupied',
      isOccupied: true,
      currentCustomers: customerCount,
      sessionStartTime: new Date(),
      totalSessionAmount: 0,
      updatedAt: new Date(),
    };

    return this.tables[tableIndex];
  }

  // QR Code operations
  async generateQRCode(tableId: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // const response = await fetch(`${this.endpoints.tablesQR}/${tableId}`, {
    //   method: 'POST',
    // });
    // if (!response.ok) throw new Error('Failed to generate QR code');
    // const data = await response.json();
    // return data.qrCode;

    const table = this.tables.find(t => t.id === tableId);
    if (!table) throw new Error('Table not found');

    const qrCodeData = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/menu?table=${table.number}`;
    return qrCodeData;
  }

  async downloadQRCode(tableId: string): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // const response = await fetch(`${this.endpoints.tablesQR}/${tableId}/download`);
    // if (!response.ok) throw new Error('Failed to download QR code');
    // return response.blob();

    // Create a simple QR code image blob for demo
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Table ${tableId}`, 100, 100);
    }

    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob!), 'image/png');
    });
  }

  // Reservation management
  async getReservations(tableId?: string): Promise<Reservation[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // const url = tableId ? `${this.endpoints.reservations}?tableId=${tableId}` : this.endpoints.reservations;
    // const response = await fetch(url);
    // if (!response.ok) throw new Error('Failed to fetch reservations');
    // return response.json();

    return tableId 
      ? this.reservations.filter(r => r.tableId === tableId)
      : [...this.reservations];
  }

  async createReservation(reservationData: CreateReservationData): Promise<Reservation> {
    await new Promise(resolve => setTimeout(resolve, 600));
    // const response = await fetch(this.endpoints.reservations, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(reservationData),
    // });
    // if (!response.ok) throw new Error('Failed to create reservation');
    // return response.json();

    const newReservation: Reservation = {
      ...reservationData,
      id: `RES-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date(),
    };

    this.reservations.push(newReservation);

    // Update table status if reservation is for today
    const today = new Date().toDateString();
    if (reservationData.reservationDate.toDateString() === today) {
      await this.updateTableStatus(reservationData.tableId, 'reserved');
    }

    return newReservation;
  }

  async updateReservation(reservationId: string, updates: UpdateReservationData): Promise<Reservation> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const reservationIndex = this.reservations.findIndex(r => r.id === reservationId);
    if (reservationIndex === -1) throw new Error('Reservation not found');

    this.reservations[reservationIndex] = {
      ...this.reservations[reservationIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return this.reservations[reservationIndex];
  }

  async cancelReservation(reservationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const reservation = this.reservations.find(r => r.id === reservationId);
    if (!reservation) throw new Error('Reservation not found');

    await this.updateReservation(reservationId, { status: 'cancelled' });

    // Update table status if it was reserved
    const table = this.tables.find(t => t.id === reservation.tableId);
    if (table && table.status === 'reserved') {
      await this.updateTableStatus(reservation.tableId, 'available');
    }
  }

  // Payment management
  async getPayments(tableId?: string): Promise<Payment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return tableId 
      ? this.payments.filter(p => p.tableId === tableId)
      : [...this.payments];
  }

  async processPayment(orderId: string, paymentData: Partial<Payment>): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const order = this.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      orderId,
      tableId: `table-${order.tableNumber}`,
      amount: order.total,
      method: paymentData.method || 'cash',
      status: 'completed',
      paidAt: new Date(),
      createdAt: new Date(),
      ...paymentData,
    };

    this.payments.push(newPayment);

    // Update order payment status
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        paymentStatus: 'paid',
        paymentMethod: newPayment.method,
      };
    }

    return newPayment;
  }

  // Analytics
  async getTableAnalytics(tableId?: string): Promise<TableAnalytics[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    // const url = tableId ? `${this.endpoints.analytics}/${tableId}` : this.endpoints.analytics;
    // const response = await fetch(url);
    // if (!response.ok) throw new Error('Failed to fetch analytics');
    // return response.json();

    return tableId 
      ? mockTableAnalytics.filter(a => a.tableId === tableId)
      : [...mockTableAnalytics];
  }

  // Table orders
  async getTableOrders(tableId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const table = this.tables.find(t => t.id === tableId);
    if (!table) throw new Error('Table not found');

    return this.orders.filter(o => o.tableNumber === table.number);
  }

  // Bulk operations
  async bulkUpdateTableStatus(tableIds: string[], status: Table['status']): Promise<Table[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedTables: Table[] = [];
    
    for (const tableId of tableIds) {
      try {
        const updatedTable = await this.updateTableStatus(tableId, status);
        updatedTables.push(updatedTable);
      } catch (error) {
        console.error(`Failed to update table ${tableId}:`, error);
      }
    }

    return updatedTables;
  }

  // Search and filter
  async searchTables(query: string): Promise<Table[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const lowercaseQuery = query.toLowerCase();
    return this.tables.filter(table => 
      table.number.toLowerCase().includes(lowercaseQuery) ||
      table.location?.toLowerCase().includes(lowercaseQuery) ||
      table.features?.some(feature => feature.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export const tablesService = new TablesService(); 