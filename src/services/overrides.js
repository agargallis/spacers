import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useContentRevision } from '../store/useContentRevision';
import { useEditMode } from '../store/useEditMode';

/**
 * Per-ITEM admin overrides, from Supabase `overrides`.
 * Keyed by (team, collection, item_key=item.id):
 *   mode 'auto'   → show the live item as-is
 *   mode 'manual' → merge `custom` field values over the live item
 *   mode 'hidden' → drop the item from the public site
 *
 * On the public site hidden items are removed; in edit mode they stay (flagged
 * `_hidden`) so the admin can toggle them back.
 */
let cache = {}; // cache[team][collection][itemId] = { mode, custom }

export function getItemOverride(team, collection, itemId) {
  return cache?.[team]?.[collection]?.[itemId] ?? null;
}

/** Apply per-item overrides to a live list (+ admin-added custom items). */
export function resolveItems(team, collection, items) {
  const list = Array.isArray(items) ? items : [];
  const editMode = useEditMode.getState().editMode;
  const liveIds = new Set(list.map((i) => i.id));
  const out = [];
  for (const it of list) {
    const ov = getItemOverride(team, collection, it.id);
    if (ov?.mode === 'hidden') {
      if (editMode) out.push({ ...it, _hidden: true });
      continue;
    }
    out.push(ov?.mode === 'manual' && ov.custom ? { ...it, ...ov.custom } : it);
  }
  // admin-added items (custom overrides whose id isn't in the live feed)
  const ovColl = cache?.[team]?.[collection] ?? {};
  for (const [id, ov] of Object.entries(ovColl)) {
    if (ov.mode === 'manual' && ov.custom && !liveIds.has(id)) out.push({ id, ...ov.custom, _added: true });
    else if (ov.mode === 'hidden' && !liveIds.has(id) && editMode) out.push({ id, ...(ov.custom || {}), _added: true, _hidden: true });
  }
  return out;
}

/** Create a new admin item (custom, not from the live feed). */
export function addItem(team, collection, item) {
  const id = `custom-${collection}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
  return upsert(team, collection, id, 'manual', { ...item, id });
}

export async function hydrateOverrides() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('overrides').select('team,collection,item_key,mode,custom');
    if (error || !data) return;
    const next = {};
    for (const r of data) {
      (((next[r.team] ??= {})[r.collection] ??= {}))[r.item_key] = { mode: r.mode, custom: r.custom };
    }
    cache = next;
    useContentRevision.getState().bump();
  } catch {
    /* keep whatever we have */
  }
}

async function upsert(team, collection, itemId, mode, custom) {
  if (!supabase) return { error: 'no supabase' };
  const { error } = await supabase.from('overrides').upsert(
    { team, collection, item_key: String(itemId), mode, custom: custom ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'team,collection,item_key' },
  );
  if (!error) {
    (((cache[team] ??= {})[collection] ??= {}))[itemId] = { mode, custom: custom ?? null };
    useContentRevision.getState().bump();
  }
  return { error };
}

export function setItemHidden(team, collection, itemId, hidden) {
  const ov = getItemOverride(team, collection, itemId);
  return upsert(team, collection, itemId, hidden ? 'hidden' : ov?.custom ? 'manual' : 'auto', ov?.custom);
}

export function setItemCustom(team, collection, itemId, custom) {
  return upsert(team, collection, itemId, 'manual', custom);
}

export function resetItem(team, collection, itemId) {
  return upsert(team, collection, itemId, 'auto', null);
}

function subscribe() {
  if (!supabase) return () => {};
  const ch = supabase
    .channel('overrides-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'overrides' }, () => hydrateOverrides())
    .subscribe();
  return () => supabase.removeChannel(ch);
}

/** Mount once (in App). */
export function useOverridesSync() {
  useEffect(() => {
    hydrateOverrides();
    return subscribe();
  }, []);
}
