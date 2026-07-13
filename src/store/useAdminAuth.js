import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

/**
 * Admin auth via Supabase Auth (email + password). RLS on the `overrides` /
 * `manual_content` tables lets an authenticated session write.
 */
export const useAdminAuth = create((set) => ({
  session: null,
  authed: false,
  loading: true,

  init: async () => {
    if (!supabase) {
      set({ loading: false });
      return;
    }
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, authed: !!data.session, loading: false });
    supabase.auth.onAuthStateChange((_event, session) =>
      set({ session, authed: !!session }),
    );
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    set({ session: data.session, authed: true });
    return { ok: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, authed: false });
  },
}));
