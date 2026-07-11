import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
  {
    variants: {
      variant: {
        veg: "bg-veg-bg text-veg",
        nonveg: "bg-nonveg-bg text-nonveg",
        spicy: "bg-spicy-bg text-spicy",
        bestseller: "bg-amber-100 text-amber-700",
        neutral: "bg-black/5 text-ink-soft",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Small square veg/non-veg indicator dot, the standard Indian menu convention. */
function DietMarker({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border",
        isVeg ? "border-veg" : "border-nonveg"
      )}
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
      role="img"
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", isVeg ? "bg-veg" : "bg-nonveg")} />
    </span>
  );
}

export { Badge, badgeVariants, DietMarker };
