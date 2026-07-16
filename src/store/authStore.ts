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

async function fetchStaffUserWithRetry(userId: string): Promise<StaffUser | null> {
  // A page refresh never hits this problem because the session is
  // already fully established. A *fresh* sign-in occasionally does,
  // because there's a brief window right after signInWithPassword()
  // resolves where the new session hasn't fully propagated for RLS
  // purposes yet, so the very first staff_users lookup can come back
  // empty. Retry a couple of times with a short delay before concluding
  // there's genuinely no profile, rather than treating a timing hiccup
  // as "logged in as the wrong role" or "no account found."
  for (let attempt = 0; attempt < 3; attempt++) {
    const staff = await fetchStaffUserById(userId);
    if (staff) return staff;
    if (attempt < 2) await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
  }
  return null;
}

async function resolveAndApplyUser(
  userId: string | null,
  set: (partial: Partial<AuthState>) => void
): Promise<StaffUser | null> {
  const myRequestId = ++requestSeq;
  if (!userId) {
    set({ currentUser: null });
    return null;
  }
  const staff = await fetchStaffUserWithRetry(userId);
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
    // Force a clean slate before signing in — if there's already an
    // active session (e.g. switching roles via quick-login without
    // logging out first), sign it out fully first. This removes any
    // chance of a leftover session/listener still resolving in the
    // background during the new sign-in, rather than just tolerating it
    // via the sequence guard above.
    await supabase.auth.signOut();

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