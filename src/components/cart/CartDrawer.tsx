import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, Tag, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { useLiveOrdersStore } from "@/store/liveOrdersStore";
import { formatINR, cn } from "@/lib/utils";
import { getCouponByCode } from "@/data/mockData";
import { useRestaurant } from "@/context/RestaurantContext";
import type { LiveOrder } from "@/types";

export function CartDrawer() {
  const navigate = useNavigate();
  const { restaurant, coupons } = useRestaurant();
  const isOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const clearCart = useCartStore((s) => s.clearCart);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const addLiveOrder = useLiveOrdersStore((s) => s.addOrder);

  const subtotal = useCartStore((s) => s.getSubtotal());
  const discount = useCartStore((s) => s.getDiscount());
  const gst = useCartStore((s) => s.getGstAmount(restaurant.gstPercent));
  const serviceCharge = useCartStore((s) =>
    s.getServiceChargeAmount(restaurant.serviceChargePercent)
  );
  const grandTotal = useCartStore((s) =>
    s.getGrandTotal(restaurant.gstPercent, restaurant.serviceChargePercent)
  );

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; ok: boolean } | null>(null);

  function handleApplyCoupon() {
    const match = getCouponByCode(coupons, couponInput);
    if (!match) {
      setCouponMessage({ text: "Invalid coupon code.", ok: false });
      return;
    }
    const result = applyCoupon(match);
    setCouponMessage({ text: result.message, ok: result.success });
  }

  function handlePlaceOrder() {
    if (items.length === 0 || tableNumber === null) return;
    const prefix = restaurant.slug.slice(0, 2).toUpperCase();
    const orderNumber = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `order_${Date.now()}`;

    const liveOrder: LiveOrder = {
      id: orderId,
      restaurantId: restaurant.id,
      tableNumber,
      orderNumber,
      items: items.map((line) => ({
        id: line.id,
        menuItemName: line.menuItem.name,
        quantity: line.quantity,
        price: line.menuItem.price,
        specialInstructions: line.specialInstructions,
      })),
      status: "new",
      source: "guest",
      placedAt: new Date().toISOString(),
      subtotal,
      gstAmount: gst,
      serviceChargeAmount: serviceCharge,
      grandTotal,
      isPaid: false,
    };
    addLiveOrder(liveOrder);

    closeCart();
    navigate("/order-success", {
      state: {
        orderNumber,
        tableNumber,
        estimatedMinutes: Math.max(...items.map((i) => i.menuItem.prepTimeMinutes), 15),
      },
    });
    clearCart();
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent title="Your cart">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <ShoppingBag className="h-5 w-5 text-ink" />
          <h2 className="font-display text-lg font-semibold text-ink">Your Order</h2>
          <span className="ml-auto mr-8 text-xs text-ink-faint">Table {tableNumber}</span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-ink-faint" />
            <p className="text-sm text-ink-soft">Your cart is empty.</p>
            <p className="text-xs text-ink-faint">Add dishes from the menu to get started.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {items.map((line) => (
                  <li key={line.id} className="flex gap-3">
                    <img
                      src={line.menuItem.imageUrl}
                      alt={line.menuItem.name}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight text-ink">
                          {line.menuItem.name}
                        </p>
                        <button
                          onClick={() => removeItem(line.id)}
                          className="text-ink-faint hover:text-nonveg"
                          aria-label={`Remove ${line.menuItem.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {line.specialInstructions && (
                        <p className="mt-0.5 line-clamp-1 text-xs italic text-ink-faint">
                          "{line.specialInstructions}"
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-lg border border-line bg-paper px-2 py-1">
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5 text-ink-soft" />
                          </button>
                          <span className="w-4 text-center text-xs font-bold tabular">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5 text-ink-soft" />
                          </button>
                        </div>
                        <span className="font-mono text-sm font-semibold tabular text-ink">
                          {formatINR(line.menuItem.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Coupon box */}
              <div className="mt-6 rounded-xl border border-dashed border-line p-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-veg" />
                      <div>
                        <p className="text-sm font-semibold text-veg">{appliedCoupon.code}</p>
                        <p className="text-xs text-ink-faint">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeCoupon();
                        setCouponMessage(null);
                      }}
                      className="text-xs font-semibold text-ink-faint hover:text-nonveg"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="h-9 text-sm"
                      />
                      <Button size="sm" variant="outline" onClick={handleApplyCoupon}>
                        Apply
                      </Button>
                    </div>
                    {couponMessage && (
                      <p
                        className={cn(
                          "mt-1.5 text-xs",
                          couponMessage.ok ? "text-veg" : "text-nonveg"
                        )}
                      >
                        {couponMessage.text}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bill summary — receipt-style */}
            <div className="ticket-perf relative border-t-0 bg-paper-raised px-5 pt-4">
              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <dt>Subtotal</dt>
                  <dd className="font-mono tabular">{formatINR(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-veg">
                    <dt>Discount</dt>
                    <dd className="font-mono tabular">−{formatINR(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-ink-soft">
                  <dt>GST</dt>
                  <dd className="font-mono tabular">{formatINR(gst)}</dd>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <dt>Service Charge</dt>
                  <dd className="font-mono tabular">{formatINR(serviceCharge)}</dd>
                </div>
                <div className="mt-1.5 flex justify-between border-t border-dashed border-line pt-2 text-base font-bold text-ink">
                  <dt>Grand Total</dt>
                  <dd className="font-mono tabular">{formatINR(grandTotal)}</dd>
                </div>
              </dl>
              <div className="py-4">
                <Button variant="accent" size="lg" className="w-full" onClick={handlePlaceOrder}>
                  Place Order · {formatINR(grandTotal)}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
