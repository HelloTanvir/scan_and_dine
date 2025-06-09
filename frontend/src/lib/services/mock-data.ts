import { Order, DashboardStats, ChartData, Table, Reservation, Payment, TableAnalytics } from '@/lib/types';

// Mock dashboard data
export const mockDashboardStats: DashboardStats = {
  totalRevenue: 12580,
  totalOrders: 42,
  avgOrderValue: 299,
  activeTables: {
    active: 8,
    total: 15,
  },
  revenueChange: 18,
  ordersChange: 12,
  avgOrderChange: -5,
  todayReservations: 12,
  pendingPayments: 3,
};

export const mockDailyOrdersData: ChartData[] = [
  { name: "Mon", value: 24, orders: 24 },
  { name: "Tue", value: 18, orders: 18 },
  { name: "Wed", value: 32, orders: 32 },
  { name: "Thu", value: 27, orders: 27 },
  { name: "Fri", value: 42, orders: 42 },
  { name: "Sat", value: 54, orders: 54 },
  { name: "Sun", value: 49, orders: 49 },
];

export const mockMenuCategoryData: ChartData[] = [
  { name: "Main Course", value: 45 },
  { name: "Appetizers", value: 20 },
  { name: "Desserts", value: 15 },
  { name: "Beverages", value: 20 },
];

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: "ORD-1234",
    tableNumber: "12",
    items: [
      { id: "1", name: "Beef Kala Bhuna", quantity: 1, price: 320, special: "Extra spicy", category: "Main Course" },
      { id: "2", name: "Chicken Biryani", quantity: 2, price: 180, special: "", category: "Main Course" },
      { id: "3", name: "Naan", quantity: 3, price: 60, special: "Garlic", category: "Bread" },
    ],
    total: 680,
    status: "pending",
    priority: "high",
    time: "10:25 AM",
    createdAt: new Date(),
    customerName: "Ahmed Hassan",
    customerPhone: "+8801712345678",
    paymentStatus: "pending",
  },
  {
    id: "ORD-1235",
    tableNumber: "7",
    items: [
      { id: "4", name: "Shorshe Ilish", quantity: 1, price: 280, special: "", category: "Fish" },
      { id: "5", name: "Steamed Rice", quantity: 2, price: 85, special: "", category: "Rice" },
    ],
    total: 450,
    status: "preparing",
    priority: "medium",
    time: "10:30 AM",
    createdAt: new Date(),
    customerName: "Fatima Khan",
    customerPhone: "+8801812345678",
    paymentStatus: "pending",
  },
  {
    id: "ORD-1236",
    tableNumber: "3",
    items: [
      { id: "6", name: "Mixed Grill Platter", quantity: 1, price: 380, special: "No bell peppers", category: "Grill" },
      { id: "7", name: "Garlic Naan", quantity: 2, price: 70, special: "", category: "Bread" },
    ],
    total: 520,
    status: "ready",
    priority: "medium",
    time: "10:45 AM",
    createdAt: new Date(),
    customerName: "Rahman Ali",
    customerPhone: "+8801912345678",
    paymentStatus: "pending",
  },
  {
    id: "ORD-1237",
    tableNumber: "9",
    items: [
      { id: "8", name: "Chicken Tikka", quantity: 2, price: 160, special: "", category: "Appetizer" },
    ],
    total: 320,
    status: "completed",
    priority: "low",
    time: "11:00 AM",
    createdAt: new Date(),
    customerName: "Nasir Ahmed",
    customerPhone: "+8801612345678",
    paymentStatus: "paid",
    paymentMethod: "card",
  },
  {
    id: "ORD-1238",
    tableNumber: "5",
    items: [
      { id: "9", name: "Beef Kala Bhuna", quantity: 2, price: 320, special: "", category: "Main Course" },
      { id: "10", name: "Chicken Biryani", quantity: 1, price: 180, special: "No onions", category: "Main Course" },
      { id: "11", name: "Plain Naan", quantity: 3, price: 60, special: "", category: "Bread" },
      { id: "12", name: "Raita", quantity: 2, price: 40, special: "", category: "Side" },
      { id: "13", name: "Mango Lassi", quantity: 2, price: 90, special: "Less sugar", category: "Beverage" },
    ],
    total: 890,
    status: "preparing",
    priority: "high",
    time: "11:15 AM",
    createdAt: new Date(),
    customerName: "Salma Begum",
    customerPhone: "+8801512345678",
    paymentStatus: "pending",
  },
];

// Mock reservations data
export const mockReservations: Reservation[] = [
  {
    id: "RES-001",
    tableId: "table-1",
    customerName: "John Smith",
    customerPhone: "+8801712345678",
    customerEmail: "john@example.com",
    partySize: 4,
    reservationDate: new Date(),
    reservationTime: "19:00",
    duration: 120,
    status: "confirmed",
    specialRequests: "Birthday celebration",
    createdAt: new Date(),
  },
  {
    id: "RES-002",
    tableId: "table-5",
    customerName: "Sarah Johnson",
    customerPhone: "+8801812345678",
    customerEmail: "sarah@example.com",
    partySize: 2,
    reservationDate: new Date(),
    reservationTime: "20:30",
    duration: 90,
    status: "confirmed",
    createdAt: new Date(),
  },
];

// Mock payments data
export const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    orderId: "ORD-1237",
    tableId: "table-9",
    amount: 320,
    method: "card",
    status: "completed",
    transactionId: "TXN-123456",
    paidAt: new Date(),
    tip: 32,
    tax: 25.6,
    createdAt: new Date(),
  },
  {
    id: "PAY-002",
    orderId: "ORD-1234",
    tableId: "table-12",
    amount: 680,
    method: "cash",
    status: "pending",
    createdAt: new Date(),
  },
];

// Enhanced mock tables data
export const mockTables: Table[] = [
  {
    id: "table-1",
    number: "1",
    capacity: 4,
    status: "reserved",
    isOccupied: false,
    qrCode: "qr-table-1",
    currentReservation: "RES-001",
    location: "Window",
    features: ["High Chair Available"],
    createdAt: new Date(),
    lastCleaned: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "table-2",
    number: "2",
    capacity: 2,
    status: "available",
    isOccupied: false,
    qrCode: "qr-table-2",
    location: "Corner",
    features: ["Wheelchair Accessible"],
    createdAt: new Date(),
    lastCleaned: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "table-3",
    number: "3",
    capacity: 6,
    status: "occupied",
    isOccupied: true,
    qrCode: "qr-table-3",
    currentOrder: "ORD-1236",
    location: "Center",
    features: [],
    createdAt: new Date(),
    currentCustomers: 4,
    sessionStartTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    totalSessionAmount: 520,
    lastCleaned: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: "table-4",
    number: "4",
    capacity: 8,
    status: "cleaning",
    isOccupied: false,
    qrCode: "qr-table-4",
    location: "Private Room",
    features: ["Private Dining", "Sound System"],
    createdAt: new Date(),
    lastCleaned: new Date(), // Currently being cleaned
  },
  {
    id: "table-5",
    number: "5",
    capacity: 4,
    status: "occupied",
    isOccupied: true,
    qrCode: "qr-table-5",
    currentOrder: "ORD-1238",
    currentReservation: "RES-002",
    location: "Window",
    features: ["High Chair Available"],
    createdAt: new Date(),
    currentCustomers: 3,
    sessionStartTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    totalSessionAmount: 890,
    lastCleaned: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  // Generate remaining tables
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `table-${i + 6}`,
    number: (i + 6).toString(),
    capacity: Math.floor(Math.random() * 6) + 2, // 2-8 capacity
    status: i < 3 ? 'occupied' : i < 6 ? 'available' : i < 8 ? 'reserved' : 'maintenance',
    isOccupied: i < 3,
    qrCode: `qr-table-${i + 6}`,
    currentOrder: i < 3 ? `ORD-${1234 + i}` : undefined,
    location: ['Window', 'Corner', 'Center', 'Patio'][Math.floor(Math.random() * 4)],
    features: Math.random() > 0.5 ? ['High Chair Available'] : [],
    createdAt: new Date(),
    currentCustomers: i < 3 ? Math.floor(Math.random() * 4) + 1 : undefined,
    sessionStartTime: i < 3 ? new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000) : undefined,
    totalSessionAmount: i < 3 ? Math.floor(Math.random() * 1000) + 200 : undefined,
    lastCleaned: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000),
  }))
] as Table[];

// Mock table analytics
export const mockTableAnalytics: TableAnalytics[] = mockTables.map((table) => ({
  tableId: table.id,
  tableNumber: table.number,
  totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  totalOrders: Math.floor(Math.random() * 50) + 10,
  avgOrderValue: Math.floor(Math.random() * 300) + 200,
  occupancyRate: Math.floor(Math.random() * 40) + 60, // 60-100%
  avgSessionDuration: Math.floor(Math.random() * 60) + 45, // 45-105 minutes
  peakHours: ['19:00-20:00', '20:00-21:00'],
  popularItems: [
    { itemName: 'Chicken Biryani', quantity: Math.floor(Math.random() * 20) + 5, revenue: Math.floor(Math.random() * 1000) + 500 },
    { itemName: 'Beef Kala Bhuna', quantity: Math.floor(Math.random() * 15) + 3, revenue: Math.floor(Math.random() * 800) + 400 },
  ],
})); 