import { teams } from './teams';

/**
 * Logos shown in the hero marquee: both Spacers teams, linking to their
 * official Basketaki The League profiles.
 */
export const heroPartners = [
  { id: 'main', name: teams.main.name, logo: teams.main.logo, url: teams.main.profileUrl },
  { id: 'beta', name: teams.beta.name, logo: teams.beta.logo, url: teams.beta.profileUrl },
];
