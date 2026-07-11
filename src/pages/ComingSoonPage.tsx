import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

/**
 * Shown to a logged-in staff member whose role doesn't have a dashboard
 * yet (chef -> step 3, owner -> step 4 on the roadmap). Keeps login
 * functional end-to-end for every role without building ahead of plan.
 */
export function ComingSoonPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        <Construction className="h-7 w-7" />
      </div>
      <h1 className="font-display text-xl font-semibold text-ink">
        {currentUser ? `${currentUser.role[0].toUpperCase()}${currentUser.role.slice(1)} dashboard` : "Dashboard"}{" "}
        is on the way
      </h1>
      <p className="max-w-xs text-sm text-ink-faint">
        {currentUser?.name ? `You're signed in as ${currentUser.name}. ` : ""}
        This role's dashboard hasn't been built yet — it's next up on the roadmap.
      </p>
      <Button variant="outline" onClick={logout} className="mt-2">
        Log out
      </Button>
    </div>
  );
}
