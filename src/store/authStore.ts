import { create } from "zustand";
import { persist } from "zustand/middleware";
import { checkStaffCredentials } from "@/data/mockData";
import type { StaffUser } from "@/types";

interface AuthState {
  currentUser: StaffUser | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

/**
 * Mock, client-side-only staff session. This is a stand-in for Supabase
 * Auth (step 5 on the roadmap) — every page reads only `currentUser` from
 * here, never the credential-checking logic directly, so swapping this
 * store's internals for a real Supabase session won't require touching
 * ProtectedRoute, the dashboards, or the login page.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,

      login: (email, password) => {
        const user = checkStaffCredentials(email, password);
        if (!user) {
          return { success: false, message: "Incorrect email or password." };
        }
        set({ currentUser: user });
        return { success: true, message: "Logged in." };
      },

      logout: () => set({ currentUser: null }),
    }),
    { name: "restobiz-staff-session" }
  )
);
