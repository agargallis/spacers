import { teams } from './teams';

/**
 * Sponsors — used by the Sponsors section (only these show there).
 */
export const heroPartners = [
  { id: 'ubd', name: 'UBD', logo: '/partners/ubd-white.png', url: 'https://ubd.gr' },
  { id: 'basketaki', name: 'Basketaki', logo: '/partners/basketaki.png', url: 'https://www.basketaki.com' },
];

/**
 * Hero carousel — the sponsors interleaved with both team crests.
 */
export const marqueeLogos = [
  { id: 'main', name: teams.main.name, logo: teams.main.logo, url: teams.main.profileUrl },
  heroPartners[0],
  { id: 'beta', name: teams.beta.name, logo: teams.beta.logo, url: teams.beta.profileUrl },
  heroPartners[1],
];
