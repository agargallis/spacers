import { teams, TEAM_KEYS } from '../data/teams';
import { contentRepository } from './contentRepository';
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

/** Roster for the active team, top scorers first. */
export async function getRoster(team) {
  assertTeam(team);
  const list = contentRepository
    .getCollection('players', team)
    .sort((a, b) => (b.ppg ?? 0) - (a.ppg ?? 0));
  return resolve(list);
}

/** Season aggregates for the active team, taken from its own standings row. */
export async function getSeasonStats(team) {
  assertTeam(team);
  const ours = contentRepository.getCollection('standings', team).find((r) => r.isOurs);
  if (!ours) {
    return resolve({ played: 0, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0, avgFor: 0, avgAgainst: 0, diff: 0 });
  }
  const played = ours.played || 0;
  return resolve({
    played,
    wins: ours.wins,
    losses: ours.losses,
    pointsFor: ours.pointsFor,
    pointsAgainst: ours.pointsAgainst,
    avgFor: played ? Math.round((ours.pointsFor / played) * 10) / 10 : 0,
    avgAgainst: played ? Math.round((ours.pointsAgainst / played) * 10) / 10 : 0,
    diff: ours.pointsFor - ours.pointsAgainst,
  });
}
