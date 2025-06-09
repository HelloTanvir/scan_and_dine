// API endpoints
export const API_ENDPOINTS = {
  ORDERS: '/api/orders',
  TABLES: '/api/tables',
  MENU: '/api/menu',
  DASHBOARD: '/api/dashboard',
  AUTH: '/api/auth',
  TABLES_QR: '/api/tables/qr-codes',
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
] as const;

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