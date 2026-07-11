import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBestSellers, getTableByNumber } from "@/data/mockData";
import { useRestaurant } from "@/context/RestaurantContext";
import { RestaurantHeader } from "@/components/menu/RestaurantHeader";
import { SearchBar } from "@/components/menu/SearchBar";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { FoodCard } from "@/components/menu/FoodCard";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/store/cartStore";
import type { MenuItem } from "@/types";

export function MenuPage() {
  const { slug, tableParam } = useParams<{ slug: string; tableParam: string }>();
  const navigate = useNavigate();
  const { restaurant, categories, menuItems, tables } = useRestaurant();
  const setScope = useCartStore((s) => s.setScope);
  const tableNumber = useCartStore((s) => s.tableNumber);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");

  // Parse table number from the URL, e.g. "table-5" -> 5, and scope the
  // cart to this restaurant + table.
  useEffect(() => {
    const parsedTable = Number(tableParam?.replace(/[^0-9]/g, ""));
    const table = getTableByNumber(tables, parsedTable);
    setScope(restaurant.id, table ? table.number : tables[0]?.number ?? 1);
  }, [tableParam, tables, restaurant.id, setScope]);

  const bestSellers = useMemo(() => getBestSellers(menuItems), [menuItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const base = query
      ? menuItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        )
      : menuItems.filter((item) => item.categoryId === activeCategory);
    return base;
  }, [search, activeCategory, menuItems]);

  function handleOpenItem(item: MenuItem) {
    navigate(`/menu/${slug}/${tableParam}/item/${item.id}`);
  }

  if (tableNumber === null) return null;

  return (
    <div className="min-h-screen bg-paper pb-28">
      <RestaurantHeader restaurant={restaurant} tableNumber={tableNumber} />

      <div className="sticky top-[68px] z-20 flex flex-col gap-3 bg-paper/95 pb-1 pt-3 backdrop-blur-sm">
        <SearchBar value={search} onChange={setSearch} />
        {!search && (
          <CategoryTabs
            categories={categories}
            activeId={activeCategory}
            onChange={setActiveCategory}
          />
        )}
      </div>

      <main className="px-4 pt-4">
        {!search && bestSellers.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 font-display text-base font-semibold text-ink">
              Popular right now
            </h2>
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
              {bestSellers.map((item) => (
                <div key={item.id} className="w-[220px] shrink-0">
                  <FoodCard item={item} onOpen={handleOpenItem} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 font-display text-base font-semibold text-ink">
            {search
              ? `Results for "${search}"`
              : categories.find((c) => c.id === activeCategory)?.name}
          </h2>
          {filteredItems.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-faint">
              No dishes found. Try a different search.
            </p>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} onOpen={handleOpenItem} />
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <CartDrawer />

      <div className="pb-6 pt-2 text-center">
        <Link
          to="/login"
          className="text-[11px] font-medium text-ink-faint underline underline-offset-4"
        >
          Staff sign in
        </Link>
      </div>
    </div>
  );
}
