import { contentRepository } from './contentRepository';
import { resolve, assertTeam } from './_client';

const TIER_ORDER = { gold: 0, silver: 1, bronze: 2 };

/** Sponsors for the active team, grouped-friendly (sorted by tier). */
export async function getSponsors(team) {
  assertTeam(team);
  const list = contentRepository
    .getCollection('sponsors', team)
    .sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9));
  return resolve(list);
}
