import { contentRepository } from './contentRepository';
import { resolve, assertTeam } from './_client';

const byDateDesc = (a, b) => new Date(b.datetime) - new Date(a.datetime);

/** Past results for the active team, most recent first. */
export async function getResults(team) {
  assertTeam(team);
  const list = contentRepository.getCollection('results', team).sort(byDateDesc);
  return resolve(list);
}

/** The most recent result, or null. */
export async function getLatestResult(team) {
  assertTeam(team);
  const latest = contentRepository.getCollection('results', team).sort(byDateDesc)[0] ?? null;
  return resolve(latest);
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
