import { contentRepository } from './contentRepository';
import { standingsHistoryMock } from '../data/standingsHistory.mock';
import { resolve, assertTeam } from './_client';

/** Full league table for the active team. */
export async function getStandings(team) {
  assertTeam(team);
  return resolve(contentRepository.getCollection('standings', team));
}

/** The row for our own club within its league. */
export async function getOurStanding(team) {
  assertTeam(team);
  const row = contentRepository.getCollection('standings', team).find((r) => r.isOurs) ?? null;
  return resolve(row);
}

/**
 * Tournaments/seasons the team has standings for, newest first. The first
 * entry is the CURRENT tournament — its rows are admin-editable via
 * getStandings(); the rest are historical (read-only, from the league site).
 */
export async function getStandingsTournaments(team) {
  assertTeam(team);
  const list = (standingsHistoryMock[team] ?? []).map(({ id, label }) => ({ id, label }));
  return resolve(list, { latency: 80 });
}

/** Read-only standings table for a past tournament (not the current one). */
export async function getStandingsForTournament(team, tournamentId) {
  assertTeam(team);
  const found = (standingsHistoryMock[team] ?? []).find((t) => t.id === tournamentId);
  return resolve(found?.rows ?? []);
}
