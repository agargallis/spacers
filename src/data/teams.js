/**
 * Team meta / registry.
 *
 * Roster + standings + results mirror the official Basketaki The League profiles
 * (basketaki.com/teams/spacers-athens|spacers-beta). Season aggregates are
 * derived live from the standings row (see teamService.getSeasonStats).
 */
export const TEAM_KEYS = ['main', 'beta'];

export const teams = {
  main: {
    id: 'spacers-main',
    key: 'main',
    name: 'Spacers Athens',
    shortName: 'Spacers',
    tagline: 'Est. 2024 · Α΄ Ομάδα',
    est: 2024,
    logo: '/spacers.png',
    accent: '#2f6bff',
    accent2: '#e8b33a',
    league: 'Basketaki The League',
    profileUrl: 'https://www.basketaki.com/teams/spacers-athens/profile',
    homeVenue: 'Κλειστό Γυμναστήριο Γαλατσίου',
  },
  beta: {
    id: 'spacers-beta',
    key: 'beta',
    name: 'Spacers Beta',
    shortName: 'Spacers B',
    tagline: 'Est. 2025 · Β΄ Ομάδα',
    est: 2025,
    logo: '/spacers_beta.png',
    accent: '#2fd662',
    accent2: '#a3e635',
    league: 'Basketaki The League',
    profileUrl: 'https://www.basketaki.com/teams/spacers-beta/profile',
    homeVenue: 'Κλειστό Γυμναστήριο Γαλατσίου',
  },
};
