import { useMemo } from "react";
import {
  ClipboardList,
  IndianRupee,
  LogOut,
  Store,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import {
  getCategoriesForRestaurant,
  getMenuItemsForRestaurant,
  getStaffForRestaurant,
  getTablesForRestaurant,
} from "@/data/mockData";
import { useAuthStore } from "@/store/authStore";
import { useLiveOrdersStore } from "@/store/liveOrdersStore";
import type { LiveOrderStatus, StaffRole } from "@/types";

/**
 * Owner Dashboard — a read-only overview across the whole restaurant.
 * Unlike Waiter/Chef, the owner doesn't act on individual orders; this
 * page reads from the same useLiveOrdersStore and the same scoped
 * mockData fetchers (getStaffForRestaurant, getTablesForRestaurant,
 * getMenuItemsForRestaurant, getCategoriesForRestaurant), scoped by
 * currentUser.restaurantId exactly like Waiter and Chef. No new data
 * concepts introduced — this page is a rollup of what already exists.
 */

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

const ROLE_LABEL: Record<StaffRole, string> = {
  waiter: "Waiter",
  chef: "Chef",
  owner: "Owner",
  manager: "Manager",
};

export function OwnerDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const orders = useLiveOrdersStore((s) => s.orders);

  const restaurantId = currentUser!.restaurantId;

  const restaurantOrders = useMemo(
    () => orders.filter((o) => o.restaurantId === restaurantId),
    [orders, restaurantId]
  );
  const staff = useMemo(() => getStaffForRestaurant(restaurantId), [restaurantId]);
  const tables = useMemo(() => getTablesForRestaurant(restaurantId), [restaurantId]);
  const menuItems = useMemo(() => getMenuItemsForRestaurant(restaurantId), [restaurantId]);
  const categories = useMemo(() => getCategoriesForRestaurant(restaurantId), [restaurantId]);

  const paidToday = restaurantOrders.filter((o) => o.isPaid);
  const revenueToday = paidToday.reduce((sum, o) => sum + o.grandTotal, 0);
  const activeOrders = restaurantOrders.filter(
    (o) => !o.isPaid && o.status !== "served" && o.status !== "rejected"
  );
  const pendingBills = restaurantOrders.filter((o) => !o.isPaid && o.status === "served");
  const avgOrderValue = restaurantOrders.length
    ? Math.round(
        restaurantOrders.reduce((sum, o) => sum + o.grandTotal, 0) / restaurantOrders.length
      )
    : 0;

  const occupiedTables = new Set(
    restaurantOrders.filter((o) => !o.isPaid && o.status !== "rejected").map((o) => o.tableNumber)
  ).size;

  const recentOrders = [...restaurantOrders]
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-paper pb-16">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-semibold text-ink">Owner Overview</h1>
            <p className="text-xs text-ink-faint">
              {currentUser?.name} · {restaurantId === "rest_001" ? "Spice Route Kitchen" : "Bombay Brew Café"}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-5">
        {/* Snapshot stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={IndianRupee} label="Revenue (paid)" value={formatINR(revenueToday)} />
          <StatCard icon={ClipboardList} label="Active orders" value={activeOrders.length} />
          <StatCard icon={Wallet} label="Pending bills" value={pendingBills.length} />
          <StatCard icon={IndianRupee} label="Avg. order value" value={formatINR(avgOrderValue)} />
          <StatCard icon={Store} label="Tables occupied" value={`${occupiedTables}/${tables.length}`} />
          <StatCard icon={Users} label="Staff on roster" value={staff.length} />
        </div>

        {/* Recent orders */}
        <section className="mt-8">
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <EmptyState text="No orders yet." />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-card">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs text-ink-faint">
                    <th className="px-4 py-2.5 font-semibold">Order</th>
                    <th className="px-4 py-2.5 font-semibold">Table</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                    <th className="px-4 py-2.5 font-semibold">Total</th>
                    <th className="px-4 py-2.5 font-semibold">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-2.5 font-mono font-semibold text-ink">{order.orderNumber}</td>
                      <td className="px-4 py-2.5 text-ink-soft">T{order.tableNumber}</td>
                      <td className="px-4 py-2.5">
                        <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                          {STATUS_LABEL[order.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-ink-soft">{formatINR(order.grandTotal)}</td>
                      <td className="px-4 py-2.5">
                        {order.isPaid ? (
                          <Badge variant="veg">Paid</Badge>
                        ) : (
                          <Badge variant="neutral">Unpaid</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* Staff roster */}
          <section>
            <h2 className="mb-3 font-display text-base font-semibold text-ink">Staff Roster</h2>
            <div className="flex flex-col gap-2">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-2xl border border-line bg-paper-raised p-3.5 shadow-card"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{member.name}</p>
                    <p className="text-xs text-ink-faint">{member.email}</p>
                  </div>
                  <Badge variant="neutral">{ROLE_LABEL[member.role]}</Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Menu snapshot */}
          <section>
            <h2 className="mb-3 font-display text-base font-semibold text-ink">Menu Snapshot</h2>
            <div className="rounded-2xl border border-line bg-paper-raised p-4 shadow-card">
              <div className="flex items-center gap-2 text-ink">
                <UtensilsCrossed className="h-4 w-4 text-ink-faint" />
                <span className="text-sm font-semibold">
                  {menuItems.length} menu items across {categories.length} categories
                </span>
              </div>
              <p className="mt-2 text-xs text-ink-faint">
                {menuItems.filter((m) => m.isAvailable).length} currently available ·{" "}
                {menuItems.filter((m) => m.isBestSeller).length} marked best-seller
              </p>
              <p className="mt-4 text-xs text-ink-faint">
                Menu editing and staff management are coming in a follow-up iteration — this
                page is read-only for now.
              </p>
            </div>
          </section>
        </div>
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
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-3.5 shadow-card">
      <Icon className="h-4 w-4 text-ink-faint" />
      <p className="mt-2 font-mono text-lg font-bold text-ink">{value}</p>
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
