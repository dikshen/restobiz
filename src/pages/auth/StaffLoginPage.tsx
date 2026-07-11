import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import type { StaffRole } from "@/types";

const ROLE_HOME: Record<StaffRole, string> = {
  waiter: "/waiter",
  chef: "/chef",
  owner: "/owner",
  manager: "/coming-soon",
};

const QUICK_LOGINS: { label: string; email: string; password: string }[] = [
  { label: "Waiter", email: "ramesh@spiceroute.test", password: "waiter123" },
  { label: "Chef", email: "anita@spiceroute.test", password: "chef123" },
  { label: "Owner", email: "vikram@spiceroute.test", password: "owner123" },
];

export function StaffLoginPage() {
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Already signed in — send them straight to their dashboard (or back
  // to whatever protected page redirected them here).
  if (currentUser) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? ROLE_HOME[currentUser.role]} replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.success) {
      setError(result.message);
    }
    // On success the component re-renders and the currentUser branch
    // above handles the redirect.
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-3xl border border-line bg-paper-raised p-8 shadow-card"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-paper">
          <ChefHat className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-center font-display text-2xl font-semibold text-ink">
          Staff sign in
        </h1>
        <p className="mt-1 text-center text-sm text-ink-faint">
          RestoBiz for waiters, chefs and owners
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-ink-soft">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@restaurant.test"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-ink-soft">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-xs font-medium text-nonveg">{error}</p>}

          <Button type="submit" size="lg" className="mt-2 w-full">
            <LogIn className="h-4 w-4" /> Sign in
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-dashed border-line bg-paper p-3 text-xs text-ink-faint">
          <p className="font-semibold text-ink-soft">Demo credentials</p>
          <p className="mt-1">Waiter · ramesh@spiceroute.test / waiter123</p>
          <p>Owner · vikram@spiceroute.test / owner123</p>
          <p>Chef · anita@spiceroute.test / chef123</p>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-center text-xs font-semibold text-ink-soft">
            Quick demo login
          </p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_LOGINS.map((demo) => (
              <Button
                key={demo.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => login(demo.email, demo.password)}
              >
                {demo.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
