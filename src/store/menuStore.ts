import { create } from "zustand";
import { menuItems as seedMenuItems } from "@/data/mockData";
import type { MenuItem } from "@/types";

interface MenuState {
  items: MenuItem[];
  getItemsForRestaurant: (restaurantId: string) => MenuItem[];
  updateItem: (id: string, updates: Partial<MenuItem>) => void;
  addItem: (item: MenuItem) => void;
}

/**
 * Runtime-mutable menu item state, seeded from the mock data — same
 * pattern as useLiveOrdersStore. Kept separate from mockData.ts so owner
 * edits (name, price, description, image, availability) don't mutate the
 * static seed module itself. RestaurantContext reads menuItems from here
 * instead of calling the mockData fetcher directly, so a guest's menu
 * page re-renders the moment an owner saves a change, within the same
 * session. This is the seam that becomes a real Supabase `menu_items`
 * table + mutation later — only this store's internals change.
 */
export const useMenuStore = create<MenuState>((set, get) => ({
  items: seedMenuItems,

  getItemsForRestaurant: (restaurantId) =>
    get().items.filter((item) => item.restaurantId === restaurantId),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),

  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));
