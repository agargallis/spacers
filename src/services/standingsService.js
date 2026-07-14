import { contentRepository } from './contentRepository';
import { standingsHistoryMock } from '../data/standingsHistory.mock';
import { getLive } from './liveContent';
import { resolveItems, getSetting, setSetting } from './overrides';
import { resolve, assertTeam } from './_client';

/** Overrides collection that holds the rows of one admin-added season. */
export const seasonCollection = (tournamentId) => `standings:${tournamentId}`;

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

/** Seasons the admin added by hand (stored per team in the settings overrides). */
export function customSeasons(team) {
  return getSetting(team, 'customSeasons', []) ?? [];
}

/**
 * Tournaments/seasons for the dropdown: the scraped ones (newest first, the
 * first being the live "current" table) followed by any admin-added seasons.
 * A newly scraped season shows up here automatically — no code change needed.
 */
export async function getStandingsTournaments(team) {
  assertTeam(team);
  const scraped = history(team).map(({ id, label }) => ({ id, label }));
  const custom = customSeasons(team).map(({ id, label }) => ({ id, label, custom: true }));
  return resolve([...scraped, ...custom], { latency: 80 });
}

/**
 * Standings table for a specific tournament.
 * - scraped season → its (read-only) historical rows
 * - admin-added season → rows built entirely from admin overrides (add/edit/hide)
 */
export async function getStandingsForTournament(team, tournamentId) {
  assertTeam(team);
  const found = history(team).find((t) => t.id === tournamentId);
  if (found) return resolve(withIds(found.rows));
  return resolve(resolveItems(team, seasonCollection(tournamentId), []));
}

/** Create a new empty season the admin can then fill with teams. Returns its id. */
export async function addCustomSeason(team, label) {
  assertTeam(team);
  const clean = String(label || '').trim();
  if (!clean) return null;
  const id = `custom-season-${Date.now().toString(36)}`;
  await setSetting(team, 'customSeasons', [...customSeasons(team), { id, label: clean }]);
  return { id, label: clean };
}

/** Remove an admin-added season from the dropdown. */
export async function removeCustomSeason(team, tournamentId) {
  assertTeam(team);
  await setSetting(
    team,
    'customSeasons',
    customSeasons(team).filter((s) => s.id !== tournamentId),
  );
}
