import { contentRepository } from './contentRepository';
import { standingsHistoryMock } from '../data/standingsHistory.mock';
import { getLive } from './liveContent';
import { resolveItems } from './overrides';
import { resolve, assertTeam } from './_client';

// Positions shift as the league plays out, so key rows on the (stable) team name.
const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zα-ω0-9-]/gi, '');
const withIds = (rows) => (Array.isArray(rows) ? rows.map((r) => ({ ...r, id: r.id ?? `std-${slug(r.team)}` })) : []);

const standingsRows = (team) =>
  resolveItems(
    team,
    'standings',
    withIds(getLive(team, 'standings') ?? contentRepository.getCollection('standings', team)),
  );

/** Full league table for the active team (custom override → live → local). */
export async function getStandings(team) {
  assertTeam(team);
  return resolve(standingsRows(team));
}

/** The row for our own club within its league. */
export async function getOurStanding(team) {
  assertTeam(team);
  return resolve(standingsRows(team).find((r) => r.isOurs) ?? null);
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
