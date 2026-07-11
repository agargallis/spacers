import { contentRepository } from './contentRepository';
import { standingsHistoryMock } from '../data/standingsHistory.mock';
import { getLive } from './liveContent';
import { resolve, assertTeam } from './_client';

/** Full league table for the active team (live from Supabase, else local). */
export async function getStandings(team) {
  assertTeam(team);
  const rows = getLive(team, 'standings') ?? contentRepository.getCollection('standings', team);
  return resolve(rows);
}

/** The row for our own club within its league. */
export async function getOurStanding(team) {
  assertTeam(team);
  const rows = getLive(team, 'standings') ?? contentRepository.getCollection('standings', team);
  return resolve(rows.find((r) => r.isOurs) ?? null);
}

const history = (team) => getLive(team, 'standings_history') ?? standingsHistoryMock[team] ?? [];

/** Tournaments/seasons the team has standings for, newest first. */
export async function getStandingsTournaments(team) {
  assertTeam(team);
  return resolve(history(team).map(({ id, label }) => ({ id, label })), { latency: 80 });
}

/** Read-only standings table for a past tournament. */
export async function getStandingsForTournament(team, tournamentId) {
  assertTeam(team);
  const found = history(team).find((t) => t.id === tournamentId);
  return resolve(found?.rows ?? []);
}
