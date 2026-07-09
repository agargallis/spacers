/**
 * Fake network client.
 *
 * The ONLY place that knows data currently comes from local mocks. Every
 * service function goes through `resolve()`, which returns a Promise with a
 * small artificial latency — exactly like a real fetch. When we swap to
 * Supabase/REST, we replace the body of these helpers and NOTHING in the
 * components or services' public signatures changes.
 */
const LATENCY_MS = 260;

const deepClone = (value) =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

/** Resolve mock data as if it came from the network. */
export function resolve(data, { latency = LATENCY_MS } = {}) {
  return new Promise((res) => {
    setTimeout(() => res(deepClone(data)), latency);
  });
}

/** Guard + normalize a team key coming from the UI. */
export function assertTeam(team) {
  if (team !== 'main' && team !== 'beta') {
    throw new Error(`Unknown team key: "${team}". Expected "main" | "beta".`);
  }
  return team;
}

/*
  --- FUTURE (Phase 3) sketch, kept here on purpose as the migration target ---

  import { supabase } from '../lib/supabaseClient';

  export async function fromTable(table, team) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('team', team)
      .order('pos', { ascending: true });
    if (error) throw error;
    return data;
  }
*/
