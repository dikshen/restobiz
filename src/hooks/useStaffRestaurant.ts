import { useEffect, useState } from "react";
import { fetchRestaurantById } from "@/lib/db";
import { useLiveOrdersStore } from "@/store/liveOrdersStore";
import type { Restaurant } from "@/types";

export function useStaffRestaurant(restaurantId: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const initLiveOrders = useLiveOrdersStore((s) => s.init);

  useEffect(() => {
    let cancelled = false;
    fetchRestaurantById(restaurantId).then((r) => {
      if (!cancelled) setRestaurant(r);
    });
    initLiveOrders(restaurantId);
    return () => {
      cancelled = true;
    };
  }, [restaurantId, initLiveOrders]);

  return restaurant;
}
