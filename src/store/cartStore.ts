import { create } from "zustand";
import type { CartItem, Coupon, MenuItem } from "@/types";

interface CartState {
  restaurantId: string | null;
  items: CartItem[];
  tableNumber: number | null;
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;

  // Resolves which restaurant + table this cart belongs to. If a
  // different restaurant is scoped in (e.g. a different QR code scanned
  // in the same tab), the cart is cleared — carrying line items across
  // restaurants would silently mix menus, prices and tax rates from two
  // separate businesses.
  setScope: (restaurantId: string, tableNumber: number) => void;
  openCart: () => void;
  closeCart: () => void;

  addItem: (menuItem: MenuItem, quantity: number, specialInstructions?: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;

  applyCoupon: (coupon: Coupon) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Derived totals — computed on read, never stored, to avoid drift.
  // Tax rates are passed in by the caller (read from the current
  // restaurant's scoped data) rather than imported here, since a single
  // cart store is now shared across whichever restaurant is in scope.
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getGstAmount: (gstPercent: number) => number;
  getServiceChargeAmount: (serviceChargePercent: number) => number;
  getGrandTotal: (gstPercent: number, serviceChargePercent: number) => number;
  getQuantityForItem: (menuItemId: string) => number;
}

function makeCartLineId(menuItemId: string, specialInstructions?: string) {
  const instructionsKey = (specialInstructions ?? "").trim().toLowerCase();
  return `${menuItemId}::${instructionsKey}`;
}

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  items: [],
  tableNumber: null,
  appliedCoupon: null,
  isCartOpen: false,

  setScope: (restaurantId, tableNumber) => {
    const current = get().restaurantId;
    if (current && current !== restaurantId) {
      set({ restaurantId, tableNumber, items: [], appliedCoupon: null });
      return;
    }
    set({ restaurantId, tableNumber });
  },
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addItem: (menuItem, quantity, specialInstructions) => {
    const lineId = makeCartLineId(menuItem.id, specialInstructions);
    set((state) => {
      const existing = state.items.find((i) => i.id === lineId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === lineId ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { id: lineId, menuItem, quantity, specialInstructions },
        ],
      };
    });
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === cartItemId ? { ...i, quantity } : i)),
    }));
  },

  removeItem: (cartItemId) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== cartItemId) })),

  clearCart: () => set({ items: [], appliedCoupon: null }),

  applyCoupon: (coupon) => {
    const subtotal = get().getSubtotal();
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `Add items worth ₹${coupon.minOrderValue - subtotal} more to use this coupon.`,
      };
    }
    set({ appliedCoupon: coupon });
    return { success: true, message: `${coupon.code} applied!` };
  },

  removeCoupon: () => set({ appliedCoupon: null }),

  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  getSubtotal: () =>
    get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

  getDiscount: () => {
    const { appliedCoupon } = get();
    const subtotal = get().getSubtotal();
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "flat") return Math.min(appliedCoupon.value, subtotal);
    return Math.round((subtotal * appliedCoupon.value) / 100);
  },

  getGstAmount: (gstPercent) => {
    const taxable = get().getSubtotal() - get().getDiscount();
    return Math.round((taxable * gstPercent) / 100);
  },

  getServiceChargeAmount: (serviceChargePercent) => {
    const taxable = get().getSubtotal() - get().getDiscount();
    return Math.round((taxable * serviceChargePercent) / 100);
  },

  getGrandTotal: (gstPercent, serviceChargePercent) => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const gst = get().getGstAmount(gstPercent);
    const serviceCharge = get().getServiceChargeAmount(serviceChargePercent);
    return subtotal - discount + gst + serviceCharge;
  },

  getQuantityForItem: (menuItemId) =>
    get()
      .items.filter((i) => i.menuItem.id === menuItemId)
      .reduce((sum, i) => sum + i.quantity, 0),
}));
