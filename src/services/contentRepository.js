import { seedContent, COLLECTIONS } from '../data/seed';

/**
 * localStorage-backed content store (Phase 2).
 *
 * This is the single place that owns persistence. Services read/write through
 * it; the public async service API stays identical, so when Phase 3 swaps this
 * for Supabase, components + services signatures don't change.
 *
 * Shape: { standings:{main,beta}, upcoming:{...}, results:{...},
 *          players:{...}, sponsors:{...}, videos:{...} }
 */
const STORAGE_KEY = 'spacers-content-v6';

const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

const isBrowser = typeof window !== 'undefined';

function read() {
  if (!isBrowser) return seedContent();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedContent();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    // Fill any missing collections from seed (forward-compatible).
    const seeded = seedContent();
    for (const c of COLLECTIONS) {
      if (!parsed[c]) parsed[c] = seeded[c];
    }
    return parsed;
  } catch (err) {
    console.error('contentRepository read failed, reseeding:', err);
    return seedContent();
  }
}

function write(tree) {
  if (isBrowser) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  }
  notify();
}

const uid = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const contentRepository = {
  /** Subscribe to any mutation. Returns an unsubscribe fn. */
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  /** Read one team-keyed collection (e.g. 'standings', 'main'). */
  getCollection(name, team) {
    const tree = read();
    return structuredClone(tree[name]?.[team] ?? []);
  },

  /** Replace an entire team collection (used by CRUD save). */
  setCollection(name, team, rows) {
    const tree = read();
    if (!tree[name]) tree[name] = {};
    tree[name][team] = rows;
    write(tree);
    return structuredClone(rows);
  },

  /** Append a new row, auto-assigning an id. */
  createItem(name, team, item) {
    const rows = this.getCollection(name, team);
    const withId = { id: uid(name), team, ...item };
    return this.setCollection(name, team, [...rows, withId]);
  },

  /** Patch a row by id. */
  updateItem(name, team, id, patch) {
    const rows = this.getCollection(name, team).map((r) =>
      r.id === id ? { ...r, ...patch } : r
    );
    return this.setCollection(name, team, rows);
  },

  /** Remove a row by id. */
  deleteItem(name, team, id) {
    const rows = this.getCollection(name, team).filter((r) => r.id !== id);
    return this.setCollection(name, team, rows);
  },

  /** Wipe back to seed data. */
  reset() {
    const seeded = seedContent();
    write(seeded);
    return seeded;
  },
};

/* ---- Contact inbox (separate key; write-only from public form) ---- */
const INBOX_KEY = 'spacers-contact-inbox';

export const contactRepository = {
  submit(entry) {
    const record = { id: uid('msg'), createdAt: new Date().toISOString(), ...entry };
    if (isBrowser) {
      const raw = window.localStorage.getItem(INBOX_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(record);
      window.localStorage.setItem(INBOX_KEY, JSON.stringify(list));
    }
    return record;
  },
  list() {
    if (!isBrowser) return [];
    const raw = window.localStorage.getItem(INBOX_KEY);
    return raw ? JSON.parse(raw) : [];
  },
};
