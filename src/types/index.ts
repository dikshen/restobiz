// Domain types for RestoBiz.
// These are intentionally shaped to map 1:1 onto future Supabase tables
// (restaurants, categories, menu_items, orders, order_items, tables).
// When Supabase is wired up, these interfaces become the row types and
// src/data/mockData.ts is replaced by src/services/*.ts queries — no
// component code should need to change.

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  coverUrl?: string;
  cuisines: string[];
  gstPercent: number;
  serviceChargePercent: number;
  currency: "INR";
}

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  number: number;
  label: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
}

export type SpiceLevel = 0 | 1 | 2 | 3;

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isBestSeller: boolean;
  spiceLevel: SpiceLevel;
  rating: number;
  ratingCount: number;
  prepTimeMinutes: number;
  ingredients: string[];
  isAvailable: boolean;
}

export interface CartItem {
  id: string; // unique cart line id (item id + instructions hash)
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = "received" | "preparing" | "ready" | "served";

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  tableNumber: number;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  serviceChargeAmount: number;
  discount: number;
  grandTotal: number;
  status: OrderStatus;
  estimatedMinutes: number;
  placedAt: string;
}

export interface Coupon {
  restaurantId: string;
  code: string;
  description: string;
  type: "percent" | "flat";
  value: number;
  minOrderValue?: number;
}

// --- Staff / auth types ---
// Shaped to map onto a future `staff_users` Supabase table + Supabase
// Auth. `role` drives which dashboard a logged-in user is routed to and
// which routes they're allowed into (see ProtectedRoute).

export type StaffRole = "waiter" | "chef" | "owner" | "manager";

export interface StaffUser {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
}

// --- Live order types (shared by Waiter + future Chef Kitchen Display) ---
// Distinct from the customer-facing `Order` above, which is a point-in-time
// receipt created at checkout. A LiveOrder is the mutable, in-progress
// version staff act on — advancing its status, marking it paid, etc.

export type LiveOrderStatus = "new" | "accepted" | "preparing" | "ready" | "served" | "rejected";

export interface LiveOrderLineItem {
  id: string;
  menuItemName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface LiveOrder {
  id: string;
  restaurantId: string;
  tableNumber: number;
  orderNumber: string;
  items: LiveOrderLineItem[];
  status: LiveOrderStatus;
  source: "guest" | "waiter";
  placedAt: string;
  subtotal: number;
  gstAmount: number;
  serviceChargeAmount: number;
  grandTotal: number;
  isPaid: boolean;
}
