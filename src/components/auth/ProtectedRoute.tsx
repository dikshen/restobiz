import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { StaffRole } from "@/types";

interface ProtectedRouteProps {
  allowedRoles: StaffRole[];
}

/**
 * Route guard for staff-only pages.
 * - No one logged in -> redirect to /login, remembering where they were headed.
 * - Logged in but wrong role (e.g. a chef opening /waiter) -> /coming-soon,
 *   since that role's dashboard doesn't exist yet.
 * - Logged in with an allowed role -> render the nested route.
 *
 * This is the seam that swaps to real Supabase session checks in step 5 —
 * only this file changes, not the dashboards themselves.
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/coming-soon" replace />;
  }

  return <Outlet />;
}
