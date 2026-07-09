import { contentRepository } from './contentRepository';
import { resolve, assertTeam } from './_client';

const byDateAsc = (a, b) => new Date(a.datetime) - new Date(b.datetime);
const byDateDesc = (a, b) => new Date(b.datetime) - new Date(a.datetime);

/** Upcoming fixtures for the active team, soonest first. */
export async function getUpcomingMatches(team) {
  assertTeam(team);
  const list = contentRepository.getCollection('upcoming', team).sort(byDateAsc);
  return resolve(list);
}

/**
 * The single next fixture. If there are no upcoming games (off-season), fall
 * back to the most recent RESULT — shown as a finished match with a zeroed
 * countdown — so the panel is never empty.
 */
export async function getNextMatch(team) {
  assertTeam(team);
  const now = Date.now();

  const upcoming = contentRepository
    .getCollection('upcoming', team)
    .filter((m) => new Date(m.datetime).getTime() >= now)
    .sort(byDateAsc)[0];
  if (upcoming) return resolve(upcoming);

  const last = contentRepository.getCollection('results', team).sort(byDateDesc)[0];
  if (!last) return resolve(null);

  return resolve({
    id: last.id,
    team,
    datetime: last.datetime,
    opponent: last.opponent,
    opponentLogo: last.opponentLogo,
    home: last.home,
    venue: '',
    finished: true,
    scoreFor: last.scoreFor,
    scoreAgainst: last.scoreAgainst,
  });
}
