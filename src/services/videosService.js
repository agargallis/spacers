import { contentRepository } from './contentRepository';
import { resolveItems } from './overrides';
import { resolve, assertTeam } from './_client';

const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

/** Game videos for the active team, newest first (with admin overrides). */
export async function getVideos(team) {
  assertTeam(team);
  const base = contentRepository.getCollection('videos', team);
  return resolve([...resolveItems(team, 'videos', base)].sort(byDateDesc));
}
