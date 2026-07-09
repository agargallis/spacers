import { useEffect, useRef, useState } from 'react';
import { useTeamStore } from '../store/useTeamStore';
import { useContentRevision } from '../store/useContentRevision';

/**
 * Generic loader for a team-aware service function.
 *
 * Usage:
 *   const { data, loading, error } = useTeamResource(getStandings);
 *
 * Re-runs automatically whenever `activeTeam` changes, so every consuming
 * component is reactive to the toggle with zero prop-drilling. Stale responses
 * (from a superseded team) are ignored to avoid race flicker.
 */
export function useTeamResource(serviceFn, { initialData = null } = {}) {
  const activeTeam = useTeamStore((s) => s.activeTeam);
  const revision = useContentRevision((s) => s.revision);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reqId = useRef(0);

  useEffect(() => {
    const id = ++reqId.current;
    setLoading(true);
    setError(null);

    serviceFn(activeTeam)
      .then((result) => {
        if (id === reqId.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (id === reqId.current) {
          setError(err);
          setLoading(false);
        }
      });
    // serviceFn is expected to be a stable module-level import.
    // `revision` re-runs the fetch after any admin mutation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam, serviceFn, revision]);

  return { data, loading, error, activeTeam };
}
