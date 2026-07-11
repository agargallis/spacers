import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client. The anon key is a public key (safe in the client bundle) —
 * real protection comes from Row Level Security on the tables. Reads come from
 * env vars; a hardcoded fallback keeps it working if .env is missing.
 */
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://vvevacpgaacqazvizftt.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZXZhY3BnYWFjcWF6dml6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NjEzMTksImV4cCI6MjA5OTMzNzMxOX0.ErcC2A4Hdp4kgE2u4-B5DvAx6T90R9lax0fQGjx0j_M';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase =
  isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

/** Table names (single source, matches the SQL schema in SUPABASE_SETUP.md). */
export const TABLES = {
  content: 'content', // one JSON blob per (team, collection)
  overrides: 'overrides', // per-item auto/manual/hidden overrides
  meta: 'meta', // sync timestamps, keep-alive heartbeat
};
