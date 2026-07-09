import { useEffect } from 'react';
import { useTeamStore } from '../store/useTeamStore';

/**
 * Mirrors the active team onto <html data-team="..."> so the CSS-variable
 * theme (accent colors, glows, grid tint) re-skins the whole app instantly.
 */
export function useThemeSync() {
  const activeTeam = useTeamStore((s) => s.activeTeam);

  useEffect(() => {
    document.documentElement.setAttribute('data-team', activeTeam);
    const theme = activeTeam === 'beta' ? '#07120b' : '#08090d';
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme);
  }, [activeTeam]);
}
