import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Placeholder admin auth (Phase 2).
 * NOTE: this is a prototype gate only — Phase 3 replaces it with real
 * Supabase auth. The password lives client-side on purpose for the demo.
 */
export const ADMIN_PASSWORD = 'spacers2024';

export const useAdminAuth = create(
  persist(
    (set) => ({
      authed: false,
      login: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ authed: true });
          return true;
        }
        return false;
      },
      logout: () => set({ authed: false }),
    }),
    {
      name: 'spacers-admin-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
