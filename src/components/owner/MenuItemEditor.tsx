import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category, MenuItem, SpiceLevel } from "@/types";

/**
 * Add/Edit form for a single menu item, used from the Owner Dashboard's
 * Menu Management section. Same form handles both create and edit —
 * pass `item` to edit, omit it to create a new one.
 *
 * Image handling: there's no file storage backend yet (that's a Supabase
 * Storage seam for later), so an uploaded photo is read via FileReader
 * and converted to a base64 data URL, which is a completely valid
 * imageUrl for an <img> tag and needs no hosting, no cost, and no
 * network call. It only lives in this browser's memory for the session
 * (same limitation as everything else pre-Supabase), but it's a real,
 * working image, not a placeholder.
 */

interface MenuItemEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  categories: Category[];
  item?: MenuItem;
  onSave: (item: MenuItem) => void;
}

const SPICE_LEVELS: { value: SpiceLevel; label: string }[] = [
  { value: 0, label: "Not spicy" },
  { value: 1, label: "Mild" },
  { value: 2, label: "Spicy" },
  { value: 3, label: "Very spicy" },
];

function emptyDraft(restaurantId: string, categories: Category[]): MenuItem {
  return {
    id: "", // filled on save
    restaurantId,
    categoryId: categories[0]?.id ?? "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    isVeg: true,
    isBestSeller: false,
    spiceLevel: 0,
    rating: 0,
    ratingCount: 0,
    prepTimeMinutes: 15,
    ingredients: [],
    isAvailable: true,
  };
}

export function MenuItemEditor({
  open,
  onOpenChange,
  restaurantId,
  categories,
  item,
  onSave,
}: MenuItemEditorProps) {
  const [draft, setDraft] = useState<MenuItem>(() => item ?? emptyDraft(restaurantId, categories));
  const [ingredientsText, setIngredientsText] = useState(item?.ingredients.join(", ") ?? "");
  const [imageError, setImageError] = useState<string | null>(null);

  // Reset the form whenever a different item is opened (or the sheet
  // reopens for "add new").
  useEffect(() => {
    if (open) {
      setDraft(item ?? emptyDraft(restaurantId, categories));
      setIngredientsText(item?.ingredients.join(", ") ?? "");
      setImageError(null);
    }
  }, [open, item, restaurantId, categories]);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setImageError("Image is too large — please use one under 3MB.");
      return;
    }
    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((d) => ({ ...d, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ingredients = ingredientsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const finalItem: MenuItem = {
      ...draft,
      id: draft.id || `item_${Date.now()}`,
      ingredients,
    };
    onSave(finalItem);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={item ? "Edit menu item" : "Add menu item"}>
        <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-y-auto p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            {item ? "Edit menu item" : "Add menu item"}
          </h2>

          {/* Image */}
          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Photo</label>
            <label
              htmlFor="item-image"
              className="flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-paper-raised"
            >
              {draft.imageUrl ? (
                <img src={draft.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-2 text-ink-faint">
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs font-medium">Tap to upload a photo</span>
                </span>
              )}
            </label>
            <input
              id="item-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {imageError && <p className="mt-1.5 text-xs font-medium text-nonveg">{imageError}</p>}
          </div>

          {/* Name */}
          <div className="mt-4">
            <label htmlFor="item-name" className="mb-1.5 block text-xs font-semibold text-ink-soft">
              Dish name
            </label>
            <Input
              id="item-name"
              required
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. Chicken Malai Tikka"
            />
          </div>

          {/* Category */}
          <div className="mt-4">
            <label htmlFor="item-category" className="mb-1.5 block text-xs font-semibold text-ink-soft">
              Category
            </label>
            <select
              id="item-category"
              required
              value={draft.categoryId}
              onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value }))}
              className="flex h-11 w-full rounded-xl border border-line bg-paper-raised px-4 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label
              htmlFor="item-description"
              className="mb-1.5 block text-xs font-semibold text-ink-soft"
            >
              Description
            </label>
            <textarea
              id="item-description"
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="Short, appetizing description customers will see"
              className="w-full resize-none rounded-xl border border-line bg-paper-raised p-3 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            />
          </div>

          {/* Price + prep time */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="item-price" className="mb-1.5 block text-xs font-semibold text-ink-soft">
                Price (₹)
              </label>
              <Input
                id="item-price"
                type="number"
                min={0}
                required
                value={draft.price || ""}
                onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label htmlFor="item-prep" className="mb-1.5 block text-xs font-semibold text-ink-soft">
                Prep time (min)
              </label>
              <Input
                id="item-prep"
                type="number"
                min={0}
                value={draft.prepTimeMinutes || ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, prepTimeMinutes: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="mt-4">
            <label
              htmlFor="item-ingredients"
              className="mb-1.5 block text-xs font-semibold text-ink-soft"
            >
              Ingredients (comma separated)
            </label>
            <Input
              id="item-ingredients"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Chicken, Cream, Garam Masala"
            />
          </div>

          {/* Spice level */}
          <div className="mt-4">
            <label htmlFor="item-spice" className="mb-1.5 block text-xs font-semibold text-ink-soft">
              Spice level
            </label>
            <select
              id="item-spice"
              value={draft.spiceLevel}
              onChange={(e) =>
                setDraft((d) => ({ ...d, spiceLevel: Number(e.target.value) as SpiceLevel }))
              }
              className="flex h-11 w-full rounded-xl border border-line bg-paper-raised px-4 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            >
              {SPICE_LEVELS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="mt-4 flex flex-col gap-2.5">
            <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={draft.isVeg}
                onChange={(e) => setDraft((d) => ({ ...d, isVeg: e.target.checked }))}
                className="h-4 w-4 rounded border-line"
              />
              Vegetarian
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={draft.isBestSeller}
                onChange={(e) => setDraft((d) => ({ ...d, isBestSeller: e.target.checked }))}
                className="h-4 w-4 rounded border-line"
              />
              Mark as best-seller
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={draft.isAvailable}
                onChange={(e) => setDraft((d) => ({ ...d, isAvailable: e.target.checked }))}
                className="h-4 w-4 rounded border-line"
              />
              Available on the menu right now
            </label>
          </div>

          <div className="mt-6 flex gap-3 pb-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {item ? "Save changes" : "Add item"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
