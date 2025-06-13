// API base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  ORDERS: `${API_BASE_URL}/orders`,
  TABLES: `${API_BASE_URL}/tables`,
  MENU: `${API_BASE_URL}/menu`,
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  AUTH: `${API_BASE_URL}/auth`,
  USERS: `${API_BASE_URL}/users`,
  TABLES_QR: `${API_BASE_URL}/tables/qr-codes`,
} as const;

// Order status configurations
export const ORDER_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'Clock',
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-blue-100 text-blue-800',
    icon: 'AlertCircle',
  },
  ready: {
    label: 'Ready',
    color: 'bg-green-100 text-green-800',
    icon: 'CheckCircle2',
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800',
    icon: 'Check',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: 'X',
  },
} as const;

// Priority configurations
export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'bg-gray-100 text-gray-800',
  },
  medium: {
    label: 'Medium',
    color: 'bg-blue-100 text-blue-800',
  },
  high: {
    label: 'High',
    color: 'bg-red-100 text-red-800',
  },
} as const;

// Chart colors
export const CHART_COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac'] as const;

// Navigation items
export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'BarChart3',
  },
  {
    name: 'Kitchen',
    href: '/kitchen',
    icon: 'ChefHat',
  },
  {
    name: 'Tables',
    href: '/tables',
    icon: 'Table2',
  },
  {
    name: 'Users',
    href: '/users',
    icon: 'Users',
  },
] as const;

// Role-based default routes
export const ROLE_DEFAULT_ROUTES = {
  ADMIN: '/dashboard',
  MANAGER: '/tables',
  STAFF: '/kitchen',
} as const;

// App metadata
export const APP_METADATA = {
  title: 'Scan and Dine',
  description: 'Modern restaurant management system with QR code ordering',
  keywords: 'restaurant, qr code, ordering, management, dashboard',
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
} as const;

// Currency
export const CURRENCY = '৳' as const; 