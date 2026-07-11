import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useContentRevision } from '../store/useContentRevision';

/**
 * Live content hydrated from Supabase `content` (populated by the
 * sync-basketaki Edge Function every 2 min). Services read from this cache
 * first and fall back to local seed data when a collection isn't available.
 * A realtime subscription re-hydrates on every server-side change.
 */
let cache = {}; // cache[team][collection] = payload

export function getLive(team, collection) {
  return cache?.[team]?.[collection] ?? null;
}

export async function hydrateLiveContent() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('content').select('team,collection,payload');
    if (error || !data) return;
    const next = {};
    for (const row of data) {
      (next[row.team] ??= {})[row.collection] = row.payload;
    }
    cache = next;
    useContentRevision.getState().bump();
  } catch {
    /* offline / not configured → keep local fallback */
  }
}

function subscribe() {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('content-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'content' }, () => hydrateLiveContent())
    .subscribe();
  return () => supabase.removeChannel(channel);
}

/** Mount once (in App): initial hydrate + live subscription. */
export function useLiveContentSync() {
  useEffect(() => {
    hydrateLiveContent();
    return subscribe();
  }, []);
}
