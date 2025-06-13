import { apiClient } from '@/lib/api/client';
import { 
  Table, 
  Reservation, 
  Payment, 
  TableAnalytics, 
  CreateTableData, 
  UpdateTableData,
  CreateReservationData,
  UpdateReservationData,
  Order,
  PaginationParams
} from '@/lib/types';
import { API_ENDPOINTS } from '@/lib/constants';
import QRCode from 'qrcode';

export interface TableFilters {
  number?: string;
  location?: string;
  status?: Table['status'];
  isOccupied?: boolean;
}

export interface SeatCustomersData {
  customerCount: number;
}

export interface BulkStatusUpdateData {
  tableIds: string[];
  status: Table['status'];
}

export class TablesService {
  private readonly baseUrl = API_ENDPOINTS.TABLES;

  // Table CRUD operations
  async getAllTables(
    filters: TableFilters = {},
    pagination: PaginationParams = { page: 0, size: 10, sortBy: 'number', sortDir: 'asc' }
  ): Promise<Table[]> {
    const params = new URLSearchParams();
    
    // Add filters
    if (filters.number) params.append('number', filters.number);
    if (filters.location) params.append('location', filters.location);
    if (filters.status) params.append('status', filters.status);
    if (filters.isOccupied !== undefined) params.append('isOccupied', filters.isOccupied.toString());
    
    // Add pagination
    params.append('page', pagination.page.toString());
    params.append('size', pagination.size.toString());
    params.append('sortBy', pagination.sortBy);
    params.append('sortDir', pagination.sortDir);

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    // Spring Boot returns Page object with 'content' property
    const response = await apiClient.get<{content: Table[]}>(url);
    return response.content;
  }

  async getTable(tableId: string): Promise<Table> {
    return apiClient.get<Table>(`${this.baseUrl}/${tableId}`);
  }

  async getTableByNumber(number: string): Promise<Table> {
    return apiClient.get<Table>(`${this.baseUrl}/number/${number}`);
  }

  async createTable(tableData: CreateTableData): Promise<Table> {
    return apiClient.post<Table>(this.baseUrl, tableData);
  }

  async updateTable(tableId: string, updates: UpdateTableData): Promise<Table> {
    return apiClient.put<Table>(`${this.baseUrl}/${tableId}`, updates);
  }

  async deleteTable(tableId: string): Promise<void> {
    return apiClient.delete<void>(`${this.baseUrl}/${tableId}`);
  }

  // Table status management
  async updateTableStatus(tableId: string, status: Table['status']): Promise<Table> {
    return apiClient.patch<Table>(`${this.baseUrl}/${tableId}/status`, { status });
  }

  async seatCustomers(tableId: string, customerCount: number): Promise<Table> {
    return apiClient.patch<Table>(`${this.baseUrl}/${tableId}/seat`, { customerCount });
  }

  // Status and availability queries
  async getTablesByStatus(status: Table['status']): Promise<Table[]> {
    return apiClient.get<Table[]>(`${this.baseUrl}/status/${status}`);
  }

  async getAvailableTables(): Promise<Table[]> {
    return apiClient.get<Table[]>(`${this.baseUrl}/available`);
  }

  async searchTables(query: string): Promise<Table[]> {
    const params = new URLSearchParams({ query });
    return apiClient.get<Table[]>(`${this.baseUrl}/search?${params.toString()}`);
  }

  // QR Code operations
  async generateQRCode(tableId: string): Promise<string> {
    try {
      // Get table details first
      const table = await this.getTable(tableId);
      
      // Generate a unique session ID for the device accessing the menu
      const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Create the menu URL with table number and session ID
      const menuUrl = `${window.location.origin}/menu?table=${table.number}&session=${sessionId}&tableId=${tableId}`;
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
        errorCorrectionLevel: 'M',
        margin: 1,
        color: {
          dark: '#16a34a', // Green color
          light: '#FFFFFF'
        },
        width: 256
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  async downloadQRCode(tableId: string, tableName: string): Promise<void> {
    try {
      // Get table details first
      const table = await this.getTable(tableId);
      
      // Generate a unique session ID for the device accessing the menu
      const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Create the menu URL with table number and session ID
      const menuUrl = `${window.location.origin}/menu?table=${table.number}&session=${sessionId}&tableId=${tableId}`;
      
      // Generate QR code as data URL with higher resolution for download
      const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
        errorCorrectionLevel: 'M',
        margin: 2,
        color: {
          dark: '#16a34a', // Green color
          light: '#FFFFFF'
        },
        width: 512 // Higher resolution for download
      });
      
      // Create a canvas to add restaurant branding
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');
      
      // Set canvas size
      canvas.width = 600;
      canvas.height = 700;
      
      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Load the QR code image
      const qrImage = new Image();
      await new Promise<void>((resolve, reject) => {
        qrImage.onload = () => resolve();
        qrImage.onerror = () => reject(new Error('Failed to load QR code image'));
        qrImage.src = qrCodeDataUrl;
      });
      
      // Add restaurant name
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Scan & Dine', canvas.width / 2, 60);
      
      // Add table info
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillText(`Table ${table.number}`, canvas.width / 2, 100);
      
      ctx.font = '18px Arial, sans-serif';
      ctx.fillText(`${table.capacity} Seats`, canvas.width / 2, 130);
      
      if (table.location) {
        ctx.fillText(`Location: ${table.location}`, canvas.width / 2, 155);
      }
      
      // Draw QR code
      ctx.drawImage(qrImage, (canvas.width - 400) / 2, 180, 400, 400);
      
      // Add instructions
      ctx.fillStyle = '#666666';
      ctx.font = '16px Arial, sans-serif';
      ctx.textAlign = 'center';
      const instructions = [
        'Scan this QR code with your phone camera',
        'to view our menu and place your order',
        'directly from your table.'
      ];
      
      instructions.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, 620 + (index * 25));
      });
      
      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Failed to create image blob');
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `table-${tableName}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 0.95);
      
    } catch (error) {
      console.error('Failed to download QR code:', error);
      throw new Error('Failed to download QR code');
    }
  }

  // Bulk operations
  async bulkUpdateTableStatus(tableIds: string[], status: Table['status']): Promise<Table[]> {
    return apiClient.patch<Table[]>(`${this.baseUrl}/bulk-status`, { tableIds, status });
  }

  // Statistics
  async getTableStatistics(): Promise<Record<string, number>> {
    return apiClient.get<Record<string, number>>(`${this.baseUrl}/statistics`);
  }

  // Legacy methods for reservations, payments, analytics (to be implemented later)
  async getReservations(tableId?: string): Promise<Reservation[]> {
    // TODO: Implement with backend reservations API
    const url = tableId ? `/api/reservations?tableId=${tableId}` : '/api/reservations';
    return apiClient.get<Reservation[]>(url);
  }

  async createReservation(reservationData: CreateReservationData): Promise<Reservation> {
    // TODO: Implement with backend reservations API
    return apiClient.post<Reservation>('/api/reservations', reservationData);
  }

  async updateReservation(reservationId: string, updates: UpdateReservationData): Promise<Reservation> {
    // TODO: Implement with backend reservations API
    return apiClient.put<Reservation>(`/api/reservations/${reservationId}`, updates);
  }

  async cancelReservation(reservationId: string): Promise<void> {
    // TODO: Implement with backend reservations API
    return apiClient.patch<void>(`/api/reservations/${reservationId}`, { status: 'cancelled' });
  }

  async getPayments(tableId?: string): Promise<Payment[]> {
    // TODO: Implement with backend payments API
    const url = tableId ? `/api/payments?tableId=${tableId}` : '/api/payments';
    return apiClient.get<Payment[]>(url);
  }

  async processPayment(orderId: string, paymentData: Partial<Payment>): Promise<Payment> {
    // TODO: Implement with backend payments API
    return apiClient.post<Payment>('/api/payments', { orderId, ...paymentData });
  }

  async getTableAnalytics(tableId?: string): Promise<TableAnalytics[]> {
    // TODO: Implement with backend analytics API
    const url = tableId ? `/api/analytics/tables/${tableId}` : '/api/analytics/tables';
    return apiClient.get<TableAnalytics[]>(url);
  }

  async getTableOrders(tableId: string): Promise<Order[]> {
    // TODO: Implement with backend orders API
    return apiClient.get<Order[]>(`/api/orders?tableId=${tableId}`);
  }
}

export const tablesService = new TablesService(); 