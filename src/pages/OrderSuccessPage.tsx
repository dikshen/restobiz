import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Circle, ChefHat, PackageCheck, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

interface OrderSuccessState {
  orderNumber: string;
  tableNumber: number;
  estimatedMinutes: number;
}

const STEPS: { key: OrderStatus; label: string; icon: typeof Check }[] = [
  { key: "received", label: "Received", icon: Check },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready", icon: PackageCheck },
  { key: "served", label: "Served", icon: UtensilsCrossed },
];

export function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderSuccessState | null;

  const [currentStep, setCurrentStep] = useState(0);

  // Demo-only status progression so the timeline feels alive when presenting.
  useEffect(() => {
    if (!state) return;
    const timers = [
      setTimeout(() => setCurrentStep(1), 3000),
      setTimeout(() => setCurrentStep(2), 9000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [state]);

  if (!state) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-ink-soft">No recent order found.</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm font-semibold text-amber-600 underline underline-offset-4"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-paper px-6 pb-10 pt-14">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-veg-bg"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Check className="h-10 w-10 text-veg" strokeWidth={3} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 text-center"
      >
        <h1 className="font-display text-2xl font-semibold text-ink">Order placed!</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Your food is on its way to the kitchen.
        </p>
      </motion.div>

      <div className="ticket-perf ticket-notch relative mt-8 w-full max-w-sm rounded-2xl border border-line bg-paper-raised px-6 py-5 shadow-card">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-ink-faint">Order number</p>
            <p className="font-mono text-base font-semibold text-ink">{state.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-ink-faint">Table</p>
            <p className="font-mono text-base font-semibold text-ink">{state.tableNumber}</p>
          </div>
        </div>
        <div className="mt-4 border-t border-dashed border-line pt-4 text-sm">
          <p className="text-ink-faint">Estimated time</p>
          <p className="font-semibold text-ink">{state.estimatedMinutes}–{state.estimatedMinutes + 5} minutes</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-10 w-full max-w-sm">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const isDone = i <= currentStep;
            const isActive = i === currentStep;
            const Icon = isDone ? step.icon : Circle;
            return (
              <div key={step.key} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-colors duration-500",
                        isDone ? "bg-veg" : "bg-line"
                      )}
                    />
                  )}
                  <motion.div
                    animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ repeat: isActive ? Infinity : 0, duration: 1.6 }}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500",
                      isDone ? "border-veg bg-veg text-white" : "border-line bg-paper text-ink-faint"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-colors duration-500",
                        i < currentStep ? "bg-veg" : "bg-line"
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-[11px] font-medium",
                    isDone ? "text-ink" : "text-ink-faint"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-10 text-sm font-semibold text-amber-600 underline underline-offset-4"
      >
        Back to menu
      </button>
    </div>
  );
}
