import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { fetchStaffUserById } from "@/lib/db";
import type { StaffUser } from "@/types";

interface AuthState {
  currentUser: StaffUser | null;
  isInitializing: boolean;
  init: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

// Shared sequence guard. Both the explicit login() call and the
// onAuthStateChange listener independently resolve "who is the current
// staff user", each with its own async fetch. Without this guard, a
// stale fetch (e.g. from a leftover previous session) can occasionally
// finish AFTER a newer one and silently overwrite the correct user with
// the wrong role — which looked like "sometimes shows the wrong
// dashboard until I refresh." Every resolution bumps the counter and
// only applies its result if it's still the most recent one requested,
// so a late, stale response is discarded instead of winning the race.
let requestSeq = 0;

async function resolveAndApplyUser(
  userId: string | null,
  set: (partial: Partial<AuthState>) => void
): Promise<StaffUser | null> {
  const myRequestId = ++requestSeq;
  if (!userId) {
    set({ currentUser: null });
    return null;
  }
  const staff = await fetchStaffUserById(userId);
  if (myRequestId === requestSeq) {
    set({ currentUser: staff });
  }
  return staff;
}

/**
 * Real Supabase Auth session. Supabase's client already persists the
 * session token itself (no zustand `persist` middleware needed here) —
 * `init()` subscribes once, on app start, to auth state changes and keeps
 * `currentUser` (the app's staff_users row, not the raw auth user) in
 * sync. Every page still only ever reads `currentUser`, exactly as
 * before, so ProtectedRoute/dashboards/login page didn't need to change
 * shape for this swap.
 */
export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isInitializing: true,

  init: () => {
    let firstEventHandled = false;
    supabase.auth.onAuthStateChange(async (_event, session) => {
      await resolveAndApplyUser(session?.user?.id ?? null, set);
      if (!firstEventHandled) {
        firstEventHandled = true;
        set({ isInitializing: false });
      }
    });
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { success: false, message: "Incorrect email or password." };
    }
    const staff = await resolveAndApplyUser(data.user.id, set);
    if (!staff) {
      await supabase.auth.signOut();
      return { success: false, message: "No staff profile found for this account." };
    }
    return { success: true, message: "Logged in." };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ currentUser: null });
  },
}));