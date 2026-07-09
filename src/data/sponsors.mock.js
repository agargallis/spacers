/**
 * Mock sponsors, keyed by team.
 * Sponsor shape → future `sponsors` table row.
 *   { id, team, name, tier, url, logo }
 * tier: 'gold' | 'silver' | 'bronze'
 * logo left null → UI renders a styled wordmark fallback.
 */
export const sponsorsMock = {
  main: [
    { id: 's-main-1', team: 'main', name: 'Olympus Sports', tier: 'gold', url: 'https://example.com', logo: null },
    { id: 's-main-2', team: 'main', name: 'Aegean Energy', tier: 'gold', url: 'https://example.com', logo: null },
    { id: 's-main-3', team: 'main', name: 'Nostos Café', tier: 'silver', url: 'https://example.com', logo: null },
    { id: 's-main-4', team: 'main', name: 'Delta Physio', tier: 'silver', url: 'https://example.com', logo: null },
    { id: 's-main-5', team: 'main', name: 'Kritikos Market', tier: 'bronze', url: 'https://example.com', logo: null },
    { id: 's-main-6', team: 'main', name: 'Blue Print Studio', tier: 'bronze', url: 'https://example.com', logo: null },
  ],
  beta: [
    { id: 's-beta-1', team: 'beta', name: 'GreenLine Gear', tier: 'gold', url: 'https://example.com', logo: null },
    { id: 's-beta-2', team: 'beta', name: 'Athens Youth Fund', tier: 'silver', url: 'https://example.com', logo: null },
    { id: 's-beta-3', team: 'beta', name: 'Proto Gym', tier: 'silver', url: 'https://example.com', logo: null },
    { id: 's-beta-4', team: 'beta', name: 'Local Roasters', tier: 'bronze', url: 'https://example.com', logo: null },
  ],
};
