import { Star, Clock, Plus, Minus, Flame } from "lucide-react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@/types";
import { Badge, DietMarker } from "@/components/ui/badge";
import { formatINR, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface FoodCardProps {
  item: MenuItem;
  onOpen: (item: MenuItem) => void;
}

export function FoodCard({ item, onOpen }: FoodCardProps) {
  const quantity = useCartStore((s) => s.getQuantityForItem(item.id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const lineId = `${item.id}::`;

  function handleAdd(e: MouseEvent) {
    e.stopPropagation();
    addItem(item, 1);
  }

  function handleIncrement(e: MouseEvent) {
    e.stopPropagation();
    updateQuantity(lineId, quantity + 1);
  }

  function handleDecrement(e: MouseEvent) {
    e.stopPropagation();
    updateQuantity(lineId, quantity - 1);
  }

  return (
    <motion.article
      layout
      onClick={() => onOpen(item)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-card transition-shadow duration-300 hover:shadow-card-hover"
      whileTap={{ scale: 0.99 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.isBestSeller && <Badge variant="bestseller">Bestseller</Badge>}
          {item.spiceLevel >= 2 && (
            <Badge variant="spicy" className="items-center">
              <Flame className="h-3 w-3" /> Spicy
            </Badge>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <div className="rounded-full bg-paper-raised/95 p-1 shadow-sm">
            <DietMarker isVeg={item.isVeg} />
          </div>
        </div>
      </div>

      {/* Ticket perforation divider between image and details */}
      <div className="ticket-perf ticket-notch relative px-4 pt-4">
        <h3 className="font-display text-[17px] font-medium leading-snug text-ink">
          {item.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
          {item.description}
        </p>

        <div className="mt-2.5 flex items-center gap-3 text-xs text-ink-faint">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-ink-soft">{item.rating}</span>
            <span>({item.ratingCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {item.prepTimeMinutes} min
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between pb-4">
          <span className="font-mono text-[15px] font-semibold tabular text-ink">
            {formatINR(item.price)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="rounded-lg border border-amber-500 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-500 hover:text-white active:scale-95"
            >
              ADD
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-amber-500 bg-amber-500 px-2 py-1 text-white"
              )}
            >
              <button
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                className="flex h-5 w-5 items-center justify-center"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-4 text-center text-xs font-bold tabular">{quantity}</span>
              <button
                onClick={handleIncrement}
                aria-label="Increase quantity"
                className="flex h-5 w-5 items-center justify-center"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
