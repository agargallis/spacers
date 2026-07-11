# Supabase Setup — Spacers (auto-sync + admin)

Project: `https://vvevacpgaacqazvizftt.supabase.co`

Everything the site reads flows through `src/services/*`. Supabase becomes the
backend without touching components. Three moving parts:

1. **Tables** (below) — hold scraped data, per-item overrides, manual content.
2. **`sync-basketaki` Edge Function** — cron **every 2 min**: fetch both
   basketaki profiles → parse → upsert into `content`.
3. **`keep-alive` Edge Function** — cron **weekly**: a tiny write so the free
   project never pauses.

Auto collections (scraped): `standings`, `standings_history`, `results`,
`roster`, `stats`. Manual (admin only): `videos`, `sponsors`, `contact`.

---

## 1) SQL schema (run in Supabase SQL editor)

```sql
-- Auto-scraped content: one row per (team, collection), JSON payload
create table if not exists content (
  team        text not null check (team in ('main','beta')),
  collection  text not null,
  payload     jsonb not null default '[]',
  updated_at  timestamptz not null default now(),
  primary key (team, collection)
);

-- Manual content managed by the admin (videos, sponsors, contact inbox)
create table if not exists manual_content (
  team        text,
  collection  text not null,
  payload     jsonb not null default '[]',
  updated_at  timestamptz not null default now(),
  primary key (collection, team)
);

-- Per-item override: hide the scraped value and/or show a custom one
create table if not exists overrides (
  id          uuid primary key default gen_random_uuid(),
  team        text not null check (team in ('main','beta')),
  collection  text not null,
  item_key    text not null,               -- row id / field path
  mode        text not null default 'auto' -- 'auto' | 'manual' | 'hidden'
              check (mode in ('auto','manual','hidden')),
  custom      jsonb,
  updated_at  timestamptz not null default now(),
  unique (team, collection, item_key)
);

-- Heartbeat / sync log
create table if not exists meta (
  id          text primary key,
  value       jsonb,
  updated_at  timestamptz not null default now()
);

-- RLS: public read, writes only for authenticated admin (or service role)
alter table content        enable row level security;
alter table manual_content enable row level security;
alter table overrides      enable row level security;
alter table meta           enable row level security;

create policy "public read"  on content        for select using (true);
create policy "public read"  on manual_content for select using (true);
create policy "public read"  on overrides      for select using (true);
create policy "public read"  on meta           for select using (true);

create policy "admin write"  on manual_content for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write"  on overrides      for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
-- content + meta are written by the Edge Function via the service_role key
```

Admin auth: create one Supabase Auth user (email/password) for the admin login
(replaces the client-side password gate).

## 2) Edge Function `sync-basketaki`

- Fetches `…/teams/spacers-athens/{profile,results,standings,roster}` and the
  beta equivalents. Parses with the same logic as the Node scripts in the
  scratchpad (`parse2.mjs`, `parse_history.mjs`, roster parser) ported to Deno.
- Upserts each `(team, collection)` payload into `content`, updates `meta`.
- Uses the **service_role** key (never shipped to the client).

Schedule (Supabase dashboard → Edge Functions → Cron, or pg_cron):
`*/2 * * * *`  → invoke `sync-basketaki`.

## 3) Edge Function `keep-alive`

`insert into meta (id,value) values ('heartbeat', now()) on conflict (id) do update set value = excluded.value, updated_at = now();`

Schedule: `0 6 * * 1` (weekly).

---

## Deploy the Edge Functions

Code is ready in `supabase/functions/`. From the project folder:

```bash
npx supabase login
npx supabase link --project-ref vvevacpgaacqazvizftt
npx supabase functions deploy sync-basketaki --no-verify-jwt
npx supabase functions deploy keep-alive --no-verify-jwt
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically into
Edge Functions — no secrets to set.

Seed once (fills the tables immediately):
```bash
curl -X POST https://vvevacpgaacqazvizftt.functions.supabase.co/sync-basketaki
```

## Schedule the cron

Enable the extensions (Dashboard → Database → Extensions): **pg_cron**, **pg_net**.
Then in the SQL editor:

```sql
select cron.schedule('sync-basketaki-2min', '*/2 * * * *', $$
  select net.http_post(url := 'https://vvevacpgaacqazvizftt.functions.supabase.co/sync-basketaki') as request_id;
$$);

select cron.schedule('keep-alive-weekly', '0 6 * * 1', $$
  select net.http_post(url := 'https://vvevacpgaacqazvizftt.functions.supabase.co/keep-alive') as request_id;
$$);
```

(Or use Dashboard → Edge Functions → Cron for a click-based schedule.)

## Frontend wiring (already prepared)

`src/lib/supabaseClient.js` is configured. Next step: point `contentRepository`
reads at `content`/`manual_content`, apply `overrides` at render, subscribe to
realtime so the 2-min sync appears live. The admin at **`/ndbajcksd`** renders
the site in edit mode with per-item controls (auto · custom · hide).
