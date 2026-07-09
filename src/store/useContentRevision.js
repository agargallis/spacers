import { useEffect } from 'react';
import { create } from 'zustand';
import { contentRepository } from '../services/contentRepository';

/**
 * A monotonically increasing counter bumped on every repository mutation.
 * `useTeamResource` depends on it, so public pages re-fetch automatically the
 * moment the admin saves an edit — no manual refresh, no prop drilling.
 */
export const useContentRevision = create((set) => ({
  revision: 0,
  bump: () => set((s) => ({ revision: s.revision + 1 })),
}));

/** Mount once (in App) to connect repository mutations to the revision store. */
export function useRepositorySync() {
  const bump = useContentRevision((s) => s.bump);
  useEffect(() => contentRepository.subscribe(bump), [bump]);
}
