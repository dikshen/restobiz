import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Star, Clock, Minus, Plus, Flame } from "lucide-react";
import { getMenuItemById } from "@/data/mockData";
import { useRestaurant } from "@/context/RestaurantContext";
import { Badge, DietMarker } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/utils";

export function ProductPage() {
  const { slug, tableParam, itemId } = useParams<{
    slug: string;
    tableParam: string;
    itemId: string;
  }>();
  const navigate = useNavigate();
  const { menuItems } = useRestaurant();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const item = itemId ? getMenuItemById(menuItems, itemId) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-ink-soft">This dish isn't on the menu anymore.</p>
        <Button variant="outline" onClick={() => navigate(`/menu/${slug}/${tableParam}`)}>
          Back to menu
        </Button>
      </div>
    );
  }

  function handleAddToCart() {
    if (!item) return;
    addItem(item, quantity, instructions.trim() || undefined);
    openCart();
    navigate(`/menu/${slug}/${tableParam}`);
  }

  return (
    <div className="min-h-screen bg-paper pb-32">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        <button
          onClick={() => navigate(`/menu/${slug}/${tableParam}`)}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper-raised/95 shadow-card"
          aria-label="Back to menu"
        >
          <ChevronLeft className="h-5 w-5 text-ink" />
        </button>
      </div>

      <div className="relative -mt-5 rounded-t-3xl bg-paper px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <DietMarker isVeg={item.isVeg} />
            {item.isBestSeller && <Badge variant="bestseller">Bestseller</Badge>}
            {item.spiceLevel >= 2 && (
              <Badge variant="spicy">
                <Flame className="h-3 w-3" /> Spicy
              </Badge>
            )}
          </div>
          <span className="font-mono text-xl font-bold tabular text-ink">
            {formatINR(item.price)}
          </span>
        </div>

        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">{item.name}</h1>
        <p className="mt-2 leading-relaxed text-ink-soft">{item.description}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-ink-faint">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-ink-soft">{item.rating}</span>
            <span>({item.ratingCount} ratings)</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {item.prepTimeMinutes} min prep
          </span>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-ink">Ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {item.ingredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full border border-line bg-paper-raised px-3 py-1 text-xs text-ink-soft"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-ink">Special instructions</h2>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="E.g. less spicy, no onions..."
            rows={3}
            maxLength={140}
            className="w-full resize-none rounded-xl border border-line bg-paper-raised p-3 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
          />
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper-raised px-5 py-4 shadow-sheet">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="flex items-center gap-4 rounded-xl border border-line bg-paper px-3 py-2.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4 text-ink-soft" />
            </button>
            <span className="w-5 text-center text-sm font-bold tabular">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
              <Plus className="h-4 w-4 text-ink-soft" />
            </button>
          </div>
          <Button variant="accent" size="lg" className="flex-1" onClick={handleAddToCart}>
            Add to cart · {formatINR(item.price * quantity)}
          </Button>
        </div>
      </div>

      <CartDrawer />
    </div>
  );
}
