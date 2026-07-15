import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { fetchMenuItemsForRestaurant, insertMenuItem, updateMenuItemRow, mapMenuItem } from "@/lib/db";
import type { MenuItem } from "@/types";

interface MenuState {
  items: MenuItem[];
  subscribedRestaurantId: string | null;
  init: (restaurantId: string) => Promise<void>;
  updateItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  addItem: (item: MenuItem) => Promise<void>;
}

let activeChannel: ReturnType<typeof supabase.channel> | null = null;

/**
 * Real Supabase-backed menu item state for the Owner Dashboard's menu
 * editor. Same pattern as useLiveOrdersStore: init() fetches once and
 * opens a realtime subscription, writes go straight to Postgres and let
 * the realtime event update local state — so an edit made here also
 * shows up on RestaurantContext's own separate menu_items subscription
 * (used by the guest-facing menu) without any direct coupling between
 * the two.
 */
export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  subscribedRestaurantId: null,

  init: async (restaurantId) => {
    if (get().subscribedRestaurantId === restaurantId) return;

    if (activeChannel) {
      supabase.removeChannel(activeChannel);
      activeChannel = null;
    }

    const items = await fetchMenuItemsForRestaurant(restaurantId);
    set({ items, subscribedRestaurantId: restaurantId });

    activeChannel = supabase
      .channel(`menu-items-owner-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_items",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          set((state) => {
            if (payload.eventType === "DELETE") {
              return { items: state.items.filter((m) => m.id !== (payload.old as any).id) };
            }
            const updated = mapMenuItem(payload.new);
            const exists = state.items.some((m) => m.id === updated.id);
            return {
              items: exists
                ? state.items.map((m) => (m.id === updated.id ? updated : m))
                : [...state.items, updated],
            };
          });
        }
      )
      .subscribe();
  },

  updateItem: async (id, updates) => {
    await updateMenuItemRow(id, updates);
  },

  addItem: async (item) => {
    await insertMenuItem(item);
  },
}));
