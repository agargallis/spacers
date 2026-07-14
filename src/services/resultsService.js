import { contentRepository } from './contentRepository';
import { getLive } from './liveContent';
import { resolveItems } from './overrides';
import { resolve, assertTeam } from './_client';

const byDateDesc = (a, b) => new Date(b.datetime) - new Date(a.datetime);

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const slug = (s) => norm(s).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

/**
 * Deterministic result id from date + opponent — stable across scrapes even if
 * basketaki inserts an older game (unlike the previous index-based ids). Admin
 * added rows keep their own `custom-…` id. Same-day, same-opponent duplicates
 * get a numeric suffix.
 */
export function withResultIds(team, list) {
  const seen = new Map();
  return (Array.isArray(list) ? list : []).map((r) => {
    let id =
      typeof r.id === 'string' && r.id.startsWith('custom-')
        ? r.id
        : `res-${team}-${String(r.datetime || '').slice(0, 10)}-${slug(r.opponent)}`;
    const n = (seen.get(id) || 0) + 1;
    seen.set(id, n);
    if (n > 1) id = `${id}-${n}`;
    return { ...r, id };
  });
}

const results = (team) =>
  [
    ...resolveItems(
      team,
      'results',
      withResultIds(team, getLive(team, 'results') ?? contentRepository.getCollection('results', team)),
    ),
  ];

/** Past results for the active team, most recent first. */
export async function getResults(team) {
  assertTeam(team);
  return resolve(results(team).sort(byDateDesc));
}

/** The most recent result, or null. */
export async function getLatestResult(team) {
  assertTeam(team);
  return resolve(results(team).sort(byDateDesc)[0] ?? null);
}

/** Aggregates over the full results history (mirrors basketaki team stats). */
export async function getResultsSummary(team) {
  assertTeam(team);
  const list = contentRepository.getCollection('results', team);
  const wins = list.filter((r) => r.scoreFor > r.scoreAgainst).length;
  const losses = list.length - wins;
  const pointsFor = list.reduce((s, r) => s + r.scoreFor, 0);
  const pointsAgainst = list.reduce((s, r) => s + r.scoreAgainst, 0);
  return resolve({
    played: list.length,
    wins,
    losses,
    pointsFor,
    pointsAgainst,
    avgFor: list.length ? Math.round((pointsFor / list.length) * 10) / 10 : 0,
    avgAgainst: list.length ? Math.round((pointsAgainst / list.length) * 10) / 10 : 0,
  });
}
