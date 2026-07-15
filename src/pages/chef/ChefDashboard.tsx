import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChefHat,
  Clock,
  LogOut,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useLiveOrdersStore } from "@/store/liveOrdersStore";
import { useStaffRestaurant } from "@/hooks/useStaffRestaurant";
import type { LiveOrder, LiveOrderStatus } from "@/types";

/**
 * Chef Kitchen Display System (KDS).
 *
 * Reads/writes the SAME useLiveOrdersStore the Waiter Dashboard uses — this
 * is intentional, not incidental. A waiter marking an order "served" and a
 * chef marking it "ready" are two views onto one shared runtime list, so a
 * status change made here is visible on /waiter immediately (and vice
 * versa) without any extra wiring, because both subscribe to the same
 * zustand store.
 *
 * Column model: the kitchen thinks in five stages — New, Accepted,
 * Preparing, Ready, Completed. Rather than invent a parallel
 * "kitchen-status" concept, "Completed" is just this page's label for the
 * existing terminal LiveOrderStatus "served" — the same status the waiter
 * dashboard already uses to mean "kitchen's part is done." One shared
 * status, two role-appropriate labels.
 *
 * "Reject" has no equivalent on the waiter side, so it maps to a new
 * LiveOrderStatus "rejected" (see src/types/index.ts). Rejected orders are
 * intentionally dropped from both this board and the waiter's active-order
 * view (see the WaiterDashboard filter) rather than left to linger in a
 * column that doesn't conceptually fit.
 */

type Column = {
  status: LiveOrderStatus;
  title: string;
};

const COLUMNS: Column[] = [
  { status: "new", title: "New" },
  { status: "accepted", title: "Accepted" },
  { status: "preparing", title: "Preparing" },
  { status: "ready", title: "Ready" },
  { status: "served", title: "Completed" },
];

const COLUMN_ACCENT: Record<LiveOrderStatus, string> = {
  new: "border-spicy bg-spicy-bg",
  accepted: "border-amber-500 bg-amber-50",
  preparing: "border-amber-500 bg-amber-50",
  ready: "border-veg bg-veg-bg",
  served: "border-line bg-paper-raised",
  rejected: "border-nonveg bg-nonveg-bg",
};

function minutesSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60_000));
}

export function ChefDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const orders = useLiveOrdersStore((s) => s.orders);
  const updateStatus = useLiveOrdersStore((s) => s.updateStatus);

  const restaurantId = currentUser!.restaurantId;
  const restaurant = useStaffRestaurant(restaurantId);

  const restaurantOrders = useMemo(
    () => orders.filter((o) => o.restaurantId === restaurantId),
    [orders, restaurantId]
  );

  const ordersByStatus = useMemo(() => {
    const map = new Map<LiveOrderStatus, LiveOrder[]>();
    for (const col of COLUMNS) map.set(col.status, []);
    for (const order of restaurantOrders) {
      if (order.status === "rejected") continue;
      map.get(order.status)?.push(order);
    }
    // Newest first within New; oldest-waiting-first everywhere else so the
    // order that's been sitting longest is the most visible on the floor.
    for (const col of COLUMNS) {
      const list = map.get(col.status)!;
      list.sort((a, b) =>
        col.status === "new"
          ? new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
          : new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime()
      );
    }
    return map;
  }, [restaurantOrders]);

  // --- New-order sound ---
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const knownNewIdsRef = useRef<Set<string>>(new Set());
  const firstRunRef = useRef(true);

  function ensureAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }

  function playBeep() {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Two quick beeps — attention-grabbing without needing an audio asset.
    [0, 0.22].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.25, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    });
  }

  function handleToggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    if (next) ensureAudioContext(); // resume/create on this user gesture
  }

  useEffect(() => {
    const currentNewIds = new Set(restaurantOrders.filter((o) => o.status === "new").map((o) => o.id));

    if (firstRunRef.current) {
      // Don't beep for orders that already existed when the chef opened
      // the board — only for ones that arrive while they're watching.
      knownNewIdsRef.current = currentNewIds;
      firstRunRef.current = false;
      return;
    }

    let hasGenuinelyNew = false;
    for (const id of currentNewIds) {
      if (!knownNewIdsRef.current.has(id)) hasGenuinelyNew = true;
    }
    if (hasGenuinelyNew && soundOn) playBeep();
    knownNewIdsRef.current = currentNewIds;
  }, [restaurantOrders, soundOn]);

  return (
    <div className="min-h-screen bg-paper pb-10">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-paper">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-ink">Kitchen Display</h1>
              <p className="text-xs text-ink-faint">
                {currentUser?.name} · {restaurant?.name ?? "…"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleToggleSound} aria-label="Toggle new-order sound">
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" /> Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-3 pt-4">
        <div className="flex gap-3 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const columnOrders = ordersByStatus.get(col.status) ?? [];
            return (
              <div key={col.status} className="flex w-[300px] flex-none flex-col sm:w-[320px]">
                <div className="mb-2 flex items-center justify-between px-1">
                  <h2 className="font-display text-base font-bold text-ink">{col.title}</h2>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-bold text-ink-soft">
                    {columnOrders.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {columnOrders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line bg-paper-raised/60 py-6 text-center text-xs text-ink-faint">
                      No orders
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onAccept={() => updateStatus(order.id, "accepted")}
                        onReject={() => updateStatus(order.id, "rejected")}
                        onAdvance={(next) => updateStatus(order.id, next)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function OrderCard({
  order,
  onAccept,
  onReject,
  onAdvance,
}: {
  order: LiveOrder;
  onAccept: () => void;
  onReject: () => void;
  onAdvance: (next: LiveOrderStatus) => void;
}) {
  const age = minutesSince(order.placedAt);

  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-4 shadow-card",
        COLUMN_ACCENT[order.status]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-lg font-extrabold text-ink">{order.orderNumber}</p>
          <p className="text-sm font-semibold text-ink-soft">Table {order.tableNumber}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-black/5 px-2 py-1 text-xs font-bold text-ink-soft">
          <Clock className="h-3.5 w-3.5" />
          {age}m
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {order.items.map((item) => (
          <li key={item.id} className="text-base font-semibold text-ink">
            <span className="tabular font-mono">{item.quantity}×</span> {item.menuItemName}
            {item.specialInstructions && (
              <span className="block pl-6 text-sm font-normal italic text-ink-faint">
                {item.specialInstructions}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col gap-2">
        {order.status === "new" && (
          <div className="flex gap-2">
            <Button
              size="lg"
              variant="outline"
              className="h-12 flex-1 border-nonveg/40 text-nonveg hover:bg-nonveg-bg"
              onClick={onReject}
            >
              <X className="h-5 w-5" /> Reject
            </Button>
            <Button size="lg" className="h-12 flex-[2]" onClick={onAccept}>
              <Check className="h-5 w-5" /> Accept
            </Button>
          </div>
        )}
        {order.status === "accepted" && (
          <Button size="lg" className="h-12 w-full" onClick={() => onAdvance("preparing")}>
            Start Preparing
          </Button>
        )}
        {order.status === "preparing" && (
          <Button size="lg" variant="accent" className="h-12 w-full" onClick={() => onAdvance("ready")}>
            Mark Ready
          </Button>
        )}
        {order.status === "ready" && (
          <Button size="lg" className="h-12 w-full" onClick={() => onAdvance("served")}>
            Mark Completed
          </Button>
        )}
        {order.status === "served" && (
          <p className="py-1 text-center text-sm font-semibold text-ink-faint">Sent to floor</p>
        )}
      </div>
    </div>
  );
}
