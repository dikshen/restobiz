import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import {
  fetchLiveOrdersForRestaurant,
  insertLiveOrder,
  updateLiveOrderStatus,
  markLiveOrderPaid,
  mapLiveOrder,
} from "@/lib/db";
import type { LiveOrder, LiveOrderStatus } from "@/types";

interface LiveOrdersState {
  orders: LiveOrder[];
  subscribedRestaurantId: string | null;
  init: (restaurantId: string) => Promise<void>;
  addOrder: (order: LiveOrder) => Promise<void>;
  updateStatus: (orderId: string, status: LiveOrderStatus) => Promise<void>;
  markPaid: (orderId: string) => Promise<void>;
}

let activeChannel: ReturnType<typeof supabase.channel> | null = null;

/**
 * Real Supabase-backed live order state, shared by Waiter, Chef, and
 * Owner dashboards. `init(restaurantId)` fetches the current orders once
 * and opens a realtime subscription scoped to that restaurant — this is
 * what actually fixes cross-tab sync: a chef updating a status writes to
 * Postgres, and every other open tab (waiter, owner, another chef
 * device) receives that change via the same realtime channel and
 * updates its own copy of `orders`. Writes (addOrder/updateStatus/
 * markPaid) don't mutate local state directly — they write to the
 * database and let the realtime event update state, so every connected
 * client (including the one that made the write) stays in sync through
 * one single path.
 */
export const useLiveOrdersStore = create<LiveOrdersState>((set, get) => ({
  orders: [],
  subscribedRestaurantId: null,

  init: async (restaurantId) => {
    if (get().subscribedRestaurantId === restaurantId) return; // already live

    if (activeChannel) {
      supabase.removeChannel(activeChannel);
      activeChannel = null;
    }

    const orders = await fetchLiveOrdersForRestaurant(restaurantId);
    set({ orders, subscribedRestaurantId: restaurantId });

    activeChannel = supabase
      .channel(`live-orders-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          set((state) => {
            if (payload.eventType === "DELETE") {
              return { orders: state.orders.filter((o) => o.id !== (payload.old as any).id) };
            }
            const updated = mapLiveOrder(payload.new);
            const exists = state.orders.some((o) => o.id === updated.id);
            return {
              orders: exists
                ? state.orders.map((o) => (o.id === updated.id ? updated : o))
                : [updated, ...state.orders],
            };
          });
        }
      )
      .subscribe();
  },

  addOrder: async (order) => {
    await insertLiveOrder(order);
  },

  updateStatus: async (orderId, status) => {
    await updateLiveOrderStatus(orderId, status);
  },

  markPaid: async (orderId) => {
    await markLiveOrderPaid(orderId);
  },
}));
