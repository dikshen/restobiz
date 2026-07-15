import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import {
  fetchCategoriesForRestaurant,
  fetchCouponsForRestaurant,
  fetchMenuItemsForRestaurant,
  fetchRestaurantBySlug,
  fetchTablesForRestaurant,
  mapMenuItem,
} from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";
import type { Category, Coupon, MenuItem, Restaurant, RestaurantTable } from "@/types";

interface RestaurantScope {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  tables: RestaurantTable[];
  coupons: Coupon[];
}

const RestaurantContext = createContext<RestaurantScope | null>(null);

/**
 * Read the current restaurant's scoped data. Must be called from a
 * component rendered underneath <RestaurantScopeLayout /> (i.e. any
 * page nested inside the /menu/:slug/:tableParam route).
 */
export function useRestaurant(): RestaurantScope {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {
    throw new Error("useRestaurant() was called outside of RestaurantScopeLayout");
  }
  return ctx;
}

/**
 * Resolves the `:slug` URL param to a restaurant via a real Supabase
 * query, then loads its scoped categories/menuItems/tables/coupons —
 * this is the seam that used to call mockData.ts synchronously and now
 * hits Postgres instead. No page below this layout needed to change.
 *
 * Also subscribes to realtime changes on menu_items for this restaurant,
 * so an owner's edit (price, availability, a new dish) shows up on an
 * already-open guest menu page without a refresh.
 */
export function RestaurantScopeLayout() {
  const { slug } = useParams<{ slug: string }>();
  const [scope, setScope] = useState<RestaurantScope | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setStatus("not-found");
      return;
    }

    setStatus("loading");
    fetchRestaurantBySlug(slug)
      .then(async (restaurant) => {
        if (cancelled) return;
        if (!restaurant) {
          setStatus("not-found");
          return;
        }
        const [categories, menuItems, tables, coupons] = await Promise.all([
          fetchCategoriesForRestaurant(restaurant.id),
          fetchMenuItemsForRestaurant(restaurant.id),
          fetchTablesForRestaurant(restaurant.id),
          fetchCouponsForRestaurant(restaurant.id),
        ]);
        if (cancelled) return;
        setScope({ restaurant, categories, menuItems, tables, coupons });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Realtime: keep menuItems in sync with owner edits while this page
  // stays open.
  useEffect(() => {
    if (!scope) return;
    const channel = supabase
      .channel(`menu-items-${scope.restaurant.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items", filter: `restaurant_id=eq.${scope.restaurant.id}` },
        (payload) => {
          setScope((prev) => {
            if (!prev) return prev;
            if (payload.eventType === "DELETE") {
              return { ...prev, menuItems: prev.menuItems.filter((m) => m.id !== payload.old.id) };
            }
            const updated = mapMenuItem(payload.new);
            const exists = prev.menuItems.some((m) => m.id === updated.id);
            return {
              ...prev,
              menuItems: exists
                ? prev.menuItems.map((m) => (m.id === updated.id ? updated : m))
                : [...prev.menuItems, updated],
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope?.restaurant.id]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-faint">Loading menu…</p>
      </div>
    );
  }

  if (status !== "ready" || !scope) {
    return <RestaurantNotFound slug={slug} />;
  }

  return (
    <RestaurantContext.Provider value={scope}>
      <Outlet />
    </RestaurantContext.Provider>
  );
}

function RestaurantNotFound({ slug }: { slug?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-paper px-6 text-center">
      <p className="text-sm font-semibold text-ink">This restaurant isn't available.</p>
      <p className="text-xs text-ink-faint">
        {slug ? `No restaurant found for "${slug}".` : "Missing restaurant in the URL."}
      </p>
    </div>
  );
}
