import { ShoppingBag } from "lucide-react";
import type { Restaurant } from "@/types";
import { useCartStore } from "@/store/cartStore";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  tableNumber: number;
}

export function RestaurantHeader({ restaurant, tableNumber }: RestaurantHeaderProps) {
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={restaurant.logoUrl}
          alt={`${restaurant.name} logo`}
          className="h-11 w-11 rounded-full object-cover ring-1 ring-line"
        />
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-semibold leading-tight text-ink">
            {restaurant.name}
          </h1>
          <p className="truncate text-xs text-ink-faint">{restaurant.cuisines.join(" · ")}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full border border-line bg-paper-raised px-3 py-1 text-xs font-semibold tabular text-ink-soft">
            Table {tableNumber}
          </span>
        </div>

        <button
          onClick={openCart}
          aria-label={`View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper-raised text-ink shadow-card active:scale-95"
        >
          <ShoppingBag className="h-4 w-4" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {itemCount > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 animate-fade-up items-center gap-2 rounded-full bg-ink px-5 py-3 text-paper shadow-card-hover active:scale-95"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="text-sm font-semibold">
            {itemCount} item{itemCount > 1 ? "s" : ""} added
          </span>
          <span className="text-sm font-bold text-amber-400">View cart</span>
        </button>
      )}
    </header>
  );
}
