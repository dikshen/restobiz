import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file (see .env.example)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Default Supabase behavior persists the session in localStorage,
    // which is shared across every tab of the same origin — so logging
    // out in one tab logs out all of them, and one login is visible
    // everywhere. For this app, different tabs deliberately represent
    // different staff members (Chef in one, Waiter in another) at the
    // same time, so each tab needs its own independent session instead.
    // sessionStorage is scoped per-tab, which gives exactly that — the
    // trade-off is a brand new tab won't inherit an existing login from
    // another tab; each tab logs in independently.
    storage: window.sessionStorage,
  },
});