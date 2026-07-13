import { teams, TEAM_KEYS } from '../data/teams';
import { contentRepository } from './contentRepository';
import { getLive } from './liveContent';
import { resolveItems } from './overrides';
import { resolve, assertTeam } from './_client';

/** All teams (meta). */
export async function getTeams() {
  return resolve(TEAM_KEYS.map((k) => teams[k]), { latency: 80 });
}

/** Meta for a single team. */
export async function getTeam(team) {
  assertTeam(team);
  return resolve(teams[team], { latency: 80 });
}

/** Roster for the active team, top scorers first (live from Supabase, else local). */
export async function getRoster(team) {
  assertTeam(team);
  const base = getLive(team, 'roster') ?? contentRepository.getCollection('players', team);
  const list = [...resolveItems(team, 'roster', base)].sort((a, b) => (b.ppg ?? 0) - (a.ppg ?? 0));
  return resolve(list);
}

/** Real season aggregates (Team Stats): live from Supabase, else local. */
export async function getSeasonStats(team) {
  assertTeam(team);
  const s = getLive(team, 'stats') ?? teams[team].season;
  const played = s.wins + s.losses;
  return resolve({
    played,
    wins: s.wins,
    losses: s.losses,
    pointsFor: s.pointsFor,
    pointsAgainst: s.pointsAgainst,
    avgFor: played ? Math.round((s.pointsFor / played) * 10) / 10 : 0,
    avgAgainst: played ? Math.round((s.pointsAgainst / played) * 10) / 10 : 0,
    diff: s.pointsFor - s.pointsAgainst,
  });
}
