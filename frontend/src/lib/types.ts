// User types
export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export type CreateUserData = {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: User["role"];
};

export type UpdateUserData = {
  username?: string;
  email?: string;
  phoneNumber?: string;
  role?: User["role"];
  status?: User["status"];
};

// Table types
export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING" | "MAINTENANCE";
  isOccupied: boolean;
  qrCode?: string;
  location?: string;
  features?: string[];
  currentCustomers?: number;
  currentOrder?: string;
  currentReservation?: string;
  sessionStartTime?: string;
  totalSessionAmount?: number;
  lastCleaned?: string;
  createdAt: string;
  updatedAt: string;
}

export type TableStatus = Table["status"] | "all";

export type CreateTableData = {
  number: string;
  capacity: number;
  location?: string;
  features?: string[];
};

export type UpdateTableData = {
  number?: string;
  capacity?: number;
  location?: string;
  features?: string[];
  status?: Table["status"];
  currentCustomers?: number;
  currentOrder?: string;
  currentReservation?: string;
  totalSessionAmount?: number;
};

// Menu types
export interface Menu {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  ingredients?: string[];
  allergens?: string[];
  dietaryTags?: string[];
  preparationTimeMinutes?: number;
  calories?: number;
  spiceLevel?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type MenuCategory = 
  | "APPETIZER" 
  | "MAIN_COURSE" 
  | "DESSERT" 
  | "BEVERAGE" 
  | "SALAD" 
  | "SOUP" 
  | "SIDE_DISH" 
  | "BREAKFAST" 
  | "LUNCH" 
  | "DINNER" 
  | "SNACK";

export type CreateMenuData = {
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  ingredients?: string[];
  allergens?: string[];
  dietaryTags?: string[];
  preparationTimeMinutes?: number;
  calories?: number;
  spiceLevel?: string;
};

export type UpdateMenuData = {
  name?: string;
  description?: string;
  price?: number;
  category?: MenuCategory;
  imageUrl?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  ingredients?: string[];
  allergens?: string[];
  dietaryTags?: string[];
  preparationTimeMinutes?: number;
  calories?: number;
  spiceLevel?: string;
};

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// Order types
export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  tableId: string;
  tableNumber: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  priority: OrderPriority;
  specialInstructions?: string;
  tip?: number;
  tax?: number;
  discount?: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  estimatedReadyTime?: string;
  actualReadyTime?: string;
  servedTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  menuItemImageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  createdAt: string;
}

export type OrderStatus = 
  | "PENDING" 
  | "CONFIRMED" 
  | "PREPARING" 
  | "READY" 
  | "SERVED" 
  | "COMPLETED" 
  | "CANCELLED";

export type OrderPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "CASH" | "CARD" | "DIGITAL_WALLET" | "BANK_TRANSFER";

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  tableId: string;
  orderItems: CreateOrderItemData[];
  specialInstructions?: string;
}

export interface CreateOrderItemData {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
}

export interface CartItem {
  menuItem: Menu;
  quantity: number;
  specialInstructions?: string;
} 