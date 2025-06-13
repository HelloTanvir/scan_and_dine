// Re-export auth types
export * from './auth';

// Re-export user types
export * from './user';

// Error handling types
export interface AppError {
  message: string;
  details?: unknown;
  code?: string;
}

// Loading state interface
export interface LoadingState {
  isLoading: boolean;
  error: AppError | null;
}

// Order types
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderPriority = 'low' | 'medium' | 'high';

// Order item interface
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  special?: string;
  category?: string;
}

// Order interface
export interface Order {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  priority: OrderPriority;
  time: string;
  createdAt: Date;
  updatedAt?: Date;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'digital';
}

// Reservation interface
export interface Reservation {
  id: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  reservationDate: Date;
  reservationTime: string;
  duration: number; // in minutes
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  specialRequests?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Payment interface
export interface Payment {
  id: string;
  orderId: string;
  tableId: string;
  amount: number;
  method: 'cash' | 'card' | 'digital';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: Date;
  refundedAt?: Date;
  tip?: number;
  discount?: number;
  tax?: number;
  createdAt: Date;
}

// Table interface
export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';
  isOccupied: boolean;
  qrCode?: string;
  currentOrder?: string;
  currentReservation?: string;
  location?: string; // e.g., "Window", "Corner", "Center"
  features?: string[]; // e.g., ["High Chair Available", "Wheelchair Accessible"]
  createdAt: Date;
  updatedAt?: Date;
  lastCleaned?: Date;
  // Current session data
  currentCustomers?: number;
  sessionStartTime?: Date;
  totalSessionAmount?: number;
}

// Dashboard stats interface
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  activeTables: {
    active: number;
    total: number;
  };
  revenueChange: number;
  ordersChange: number;
  avgOrderChange: number;
  todayReservations?: number;
  pendingPayments?: number;
}

// Chart data interface
export interface ChartData {
  name: string;
  value: number;
  orders?: number;
}

// Table filter options
export type TableStatus = 'all' | 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';
export type TableSortBy = 'number' | 'capacity' | 'status' | 'revenue';

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form data types
export interface CreateTableData {
  number: string;
  capacity: number;
  location?: string;
  features?: string[];
}

export interface UpdateTableData extends Partial<CreateTableData> {
  status?: Table['status'];
}

export interface CreateReservationData {
  tableId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  reservationDate: Date;
  reservationTime: string;
  duration: number;
  specialRequests?: string;
}

export interface UpdateReservationData extends Partial<CreateReservationData> {
  status?: Reservation['status'];
}

// Table analytics
export interface TableAnalytics {
  tableId: string;
  tableNumber: string;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  occupancyRate: number; // percentage
  avgSessionDuration: number; // in minutes
  peakHours: string[];
  popularItems: Array<{
    itemName: string;
    quantity: number;
    revenue: number;
  }>;
}

// Restaurant settings
export interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  reservationSettings: {
    maxAdvanceDays: number;
    minAdvanceHours: number;
    defaultDuration: number;
    allowWalkIns: boolean;
  };
  paymentMethods: Array<'cash' | 'card' | 'digital'>;
  taxRate: number;
  serviceChargeRate: number;
} 