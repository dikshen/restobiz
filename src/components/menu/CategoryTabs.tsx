import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  onChange: (id: string) => void;
}

export function CategoryTabs({ categories, activeId, onChange }: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Menu categories"
      className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3"
    >
      {categories.map((cat) => {
        const isActive = cat.id === activeId;
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
              isActive
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper-raised text-ink-soft hover:border-ink/30"
            )}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
