import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  LogOut,
  Search,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatINR } from "@/lib/utils";
import { fetchTablesForRestaurant } from "@/lib/db";
import { useAuthStore } from "@/store/authStore";
import { useLiveOrdersStore } from "@/store/liveOrdersStore";
import { useStaffRestaurant } from "@/hooks/useStaffRestaurant";
import type { LiveOrder, LiveOrderStatus, RestaurantTable } from "@/types";

const STATUS_FLOW: LiveOrderStatus[] = ["new", "accepted", "preparing", "ready", "served"];

const STATUS_LABEL: Record<LiveOrderStatus, string> = {
  new: "New",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  rejected: "Rejected",
};

const STATUS_BADGE_VARIANT: Record<LiveOrderStatus, "neutral" | "spicy" | "bestseller" | "veg" | "nonveg"> = {
  new: "spicy",
  accepted: "bestseller",
  preparing: "bestseller",
  ready: "veg",
  served: "neutral",
  rejected: "nonveg",
};

function nextStatus(status: LiveOrderStatus): LiveOrderStatus | null {
  const i = STATUS_FLOW.indexOf(status);
  return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
}

type TableState = "free" | "occupied" | "bill_requested";

export function WaiterDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const orders = useLiveOrdersStore((s) => s.orders);
  const updateStatus = useLiveOrdersStore((s) => s.updateStatus);
  const markPaid = useLiveOrdersStore((s) => s.markPaid);

  const [search, setSearch] = useState("");
  const [tableFilter, setTableFilter] = useState<number | null>(null);
  const [kitchenCalled, setKitchenCalled] = useState<Record<string, boolean>>({});

  const restaurantId = currentUser!.restaurantId;
  const restaurant = useStaffRestaurant(restaurantId);

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  useEffect(() => {
    fetchTablesForRestaurant(restaurantId).then(setTables);
  }, [restaurantId]);
  const restaurantOrders = useMemo(
    () => orders.filter((o) => o.restaurantId === restaurantId),
    [orders, restaurantId]
  );

  const activeOrders = restaurantOrders.filter(
    (o) => !o.isPaid && o.status !== "served" && o.status !== "rejected"
  );
  const billsPending = restaurantOrders.filter((o) => !o.isPaid && o.status === "served");
  const customersWaiting = restaurantOrders.filter((o) => o.status === "new").length;

  const tableStateByNumber = useMemo(() => {
    const map = new Map<number, TableState>();
    for (const table of tables) map.set(table.number, "free");
    for (const order of restaurantOrders) {
      if (order.isPaid || order.status === "rejected") continue;
      map.set(order.tableNumber, order.status === "served" ? "bill_requested" : "occupied");
    }
    return map;
  }, [tables, restaurantOrders]);

  function matchesSearch(order: LiveOrder) {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(q) || String(order.tableNumber).includes(q)
    );
  }

  const visibleActiveOrders = activeOrders
    .filter(matchesSearch)
    .filter((o) => tableFilter === null || o.tableNumber === tableFilter);

  const visibleBills = billsPending
    .filter(matchesSearch)
    .filter((o) => tableFilter === null || o.tableNumber === tableFilter);

  function handleCallKitchen(orderId: string) {
    setKitchenCalled((prev) => ({ ...prev, [orderId]: true }));
    setTimeout(() => {
      setKitchenCalled((prev) => ({ ...prev, [orderId]: false }));
    }, 4000);
  }

  return (
    <div className="min-h-screen bg-paper pb-16">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-semibold text-ink">Waiter Dashboard</h1>
            <p className="text-xs text-ink-faint">
              {currentUser?.name} · {restaurant?.name ?? "…"}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-5">
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Users} label="Customers waiting" value={customersWaiting} />
          <StatCard icon={Clock} label="Active orders" value={activeOrders.length} />
          <StatCard icon={Wallet} label="Pending bills" value={billsPending.length} />
          <StatCard
            icon={CheckCircle2}
            label="Free tables"
            value={[...tableStateByNumber.values()].filter((s) => s === "free").length}
          />
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or table..."
            className="pl-9"
          />
        </div>

        {/* Tables overview */}
        <section className="mt-6">
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Tables Overview</h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {tables.map((table) => {
              const state = tableStateByNumber.get(table.number) ?? "free";
              const isSelected = tableFilter === table.number;
              return (
                <button
                  key={table.id}
                  onClick={() => setTableFilter(isSelected ? null : table.number)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 rounded-xl border py-3 text-xs font-semibold transition-all",
                    isSelected && "ring-2 ring-amber-500",
                    state === "free" && "border-line bg-paper-raised text-ink-soft",
                    state === "occupied" && "border-amber-200 bg-amber-50 text-amber-700",
                    state === "bill_requested" && "border-nonveg/30 bg-nonveg-bg text-nonveg"
                  )}
                >
                  <span>T{table.number}</span>
                  <span className="text-[10px] font-normal opacity-80">
                    {state === "free" ? "Free" : state === "occupied" ? "Occupied" : "Bill"}
                  </span>
                </button>
              );
            })}
          </div>
          {tableFilter !== null && (
            <button
              onClick={() => setTableFilter(null)}
              className="mt-2 text-xs font-semibold text-amber-600 underline underline-offset-4"
            >
              Clear table filter (Table {tableFilter})
            </button>
          )}
        </section>

        {/* Current orders */}
        <section className="mt-8">
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Current Orders</h2>
          {visibleActiveOrders.length === 0 ? (
            <EmptyState text="No active orders right now." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleActiveOrders.map((order) => {
                const advance = nextStatus(order.status);
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-line bg-paper-raised p-4 shadow-card"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-bold text-ink">{order.orderNumber}</p>
                        <p className="text-xs text-ink-faint">Table {order.tableNumber}</p>
                      </div>
                      <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                        {STATUS_LABEL[order.status]}
                      </Badge>
                    </div>

                    <ul className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>
                            {item.quantity}× {item.menuItemName}
                          </span>
                          <span className="font-mono tabular">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex items-center justify-between border-t border-dashed border-line pt-3">
                      <span className="font-mono text-sm font-bold text-ink">
                        {formatINR(order.grandTotal)}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCallKitchen(order.id)}
                        >
                          <Bell className="h-3.5 w-3.5" />
                          {kitchenCalled[order.id] ? "Notified" : "Call kitchen"}
                        </Button>
                        {advance && (
                          <Button size="sm" onClick={() => updateStatus(order.id, advance)}>
                            Mark {STATUS_LABEL[advance]}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Pending bills */}
        <section className="mt-8">
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Pending Bills</h2>
          {visibleBills.length === 0 ? (
            <EmptyState text="No bills waiting on payment." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleBills.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-line bg-paper-raised p-4 shadow-card"
                >
                  <div>
                    <p className="font-mono text-sm font-bold text-ink">{order.orderNumber}</p>
                    <p className="text-xs text-ink-faint">
                      Table {order.tableNumber} · {formatINR(order.grandTotal)}
                    </p>
                  </div>
                  <Button size="sm" variant="accent" onClick={() => markPaid(order.id)}>
                    Mark Bill Paid
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="mt-10 text-center text-xs text-ink-faint">
          Manual order creation, table merge/split, split bill and printing are coming in a
          follow-up iteration.
        </p>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-3.5 shadow-card">
      <Icon className="h-4 w-4 text-ink-faint" />
      <p className="mt-2 font-mono text-xl font-bold text-ink">{value}</p>
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-paper-raised/60 py-8 text-center text-sm text-ink-faint">
      {text}
    </div>
  );
}
