import { create } from "zustand";
import { liveOrders as seedOrders } from "@/data/mockData";
import type { LiveOrder, LiveOrderStatus } from "@/types";

interface LiveOrdersState {
  orders: LiveOrder[];
  getOrdersForRestaurant: (restaurantId: string) => LiveOrder[];
  addOrder: (order: LiveOrder) => void;
  updateStatus: (orderId: string, status: LiveOrderStatus) => void;
  markPaid: (orderId: string) => void;
}

/**
 * Runtime-mutable order state, seeded from the mock data. Kept separate
 * from mockData.ts (which stays a static seed) so status changes and
 * payments during a session don't mutate the "database" module itself.
 * This is the store the Chef Kitchen Display (step 3) will also read
 * from — same orders, filtered/rendered differently per role.
 */
export const useLiveOrdersStore = create<LiveOrdersState>((set, get) => ({
  orders: seedOrders,

  getOrdersForRestaurant: (restaurantId) =>
    get().orders.filter((o) => o.restaurantId === restaurantId),

  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),

  updateStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    })),

  markPaid: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, isPaid: true } : o)),
    })),
}));
