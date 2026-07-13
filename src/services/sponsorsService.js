import { heroPartners } from '../data/partners';
import { resolveItems } from './overrides';
import { resolve, assertTeam } from './_client';

/** Sponsors for the active team (defaults shared; admin-overridable per team). */
export async function getSponsors(team) {
  assertTeam(team);
  return resolve(resolveItems(team, 'sponsors', heroPartners));
}
