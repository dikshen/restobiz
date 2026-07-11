import { createContext, useContext, useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import {
  getCategoriesForRestaurant,
  getCouponsForRestaurant,
  getRestaurantBySlug,
  getTablesForRestaurant,
} from "@/data/mockData";
import { useMenuStore } from "@/store/menuStore";
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
 * Resolves the `:slug` URL param to a restaurant ONCE, then provides its
 * scoped categories/menuItems/tables/coupons to every nested route via
 * context. This is the seam where a real Supabase query (scoped by
 * restaurant_id, protected by RLS) will slot in later — no page
 * component below this layout needs to change when that happens.
 */
export function RestaurantScopeLayout() {
  const { slug } = useParams<{ slug: string }>();
  const allMenuItems = useMenuStore((s) => s.items);

  const scope = useMemo<RestaurantScope | null>(() => {
    if (!slug) return null;
    const restaurant = getRestaurantBySlug(slug);
    if (!restaurant) return null;
    return {
      restaurant,
      categories: getCategoriesForRestaurant(restaurant.id),
      menuItems: allMenuItems.filter((item) => item.restaurantId === restaurant.id),
      tables: getTablesForRestaurant(restaurant.id),
      coupons: getCouponsForRestaurant(restaurant.id),
    };
  }, [slug, allMenuItems]);

  if (!scope) {
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
