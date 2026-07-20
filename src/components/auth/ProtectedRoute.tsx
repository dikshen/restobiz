import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { StaffRole } from "@/types";

interface ProtectedRouteProps {
  allowedRoles: StaffRole[];
}

/**
 * Route guard for staff-only pages, backed by a real Supabase Auth
 * session.
 * - Session still restoring on page load -> show a brief loading state
 *   instead of redirecting, so a refresh on /chef doesn't briefly bounce
 *   an already-logged-in chef to /login before their session resolves.
 * - No one logged in -> redirect to /login, remembering where they were headed.
 * - Logged in but wrong role (e.g. a chef opening /waiter) -> /coming-soon.
 * - Logged in with an allowed role -> render the nested route.
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-faint">Loading…</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    console.warn("[ProtectedRoute] redirecting to /coming-soon", {
      path: location.pathname,
      currentUserRole: currentUser.role,
      currentUserName: currentUser.name,
      allowedRoles,
    });
    return <Navigate to="/coming-soon" replace />;
  }

  return <Outlet />;
}