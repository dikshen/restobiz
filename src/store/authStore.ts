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
      if (session?.user) {
        const staff = await fetchStaffUserById(session.user.id);
        set({ currentUser: staff });
      } else {
        set({ currentUser: null });
      }
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
    const staff = await fetchStaffUserById(data.user.id);
    if (!staff) {
      await supabase.auth.signOut();
      return { success: false, message: "No staff profile found for this account." };
    }
    set({ currentUser: staff });
    return { success: true, message: "Logged in." };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ currentUser: null });
  },
}));
