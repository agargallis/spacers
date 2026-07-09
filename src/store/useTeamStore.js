import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { teams } from '../data/teams';

/**
 * Global "active team" state. This is the single source of truth that every
 * page/section reacts to. Persisted so a visitor's choice survives reloads.
 */
export const useTeamStore = create(
  persist(
    (set, get) => ({
      activeTeam: 'main', // 'main' | 'beta'
      setTeam: (team) => {
        if (team !== 'main' && team !== 'beta') return;
        set({ activeTeam: team });
      },
      toggleTeam: () => set({ activeTeam: get().activeTeam === 'main' ? 'beta' : 'main' }),
    }),
    {
      name: 'spacers-active-team',
      partialize: (state) => ({ activeTeam: state.activeTeam }),
    }
  )
);

/** Convenience selector: the full meta object for the active team. */
export const useActiveTeamMeta = () => {
  const activeTeam = useTeamStore((s) => s.activeTeam);
  return teams[activeTeam];
};
