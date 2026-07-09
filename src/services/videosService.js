import { contentRepository } from './contentRepository';
import { resolve, assertTeam } from './_client';

const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

/** Game videos for the active team, newest first. */
export async function getVideos(team) {
  assertTeam(team);
  return resolve(contentRepository.getCollection('videos', team).sort(byDateDesc));
}
