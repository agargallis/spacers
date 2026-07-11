// Supabase Edge Function: sync-basketaki
// Scrapes both Spacers profiles from basketaki.com every 2 minutes and upserts
// the parsed data into the `content` table. Runs with the service_role key.
//
// Deploy:  supabase functions deploy sync-basketaki --no-verify-jwt
// Cron:    every 2 minutes (see SUPABASE_SETUP.md)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const BASE = 'https://www.basketaki.com/teams';
const TEAM_CDN = 'https://basketaki-web.b-cdn.net/teams';
const UA = 'Mozilla/5.0 (compatible; SpacersSync/1.0)';

const TEAMS = [
  { key: 'main', slug: 'spacers-athens', name: 'Spacers Athens' },
  { key: 'beta', slug: 'spacers-beta', name: 'Spacers Beta' },
];

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const deent = (s: string) =>
  s.replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
const teamLogo = (slug?: string) => (slug ? `${TEAM_CDN}/${slug}.png` : null);
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const isoFromGr = (d: string) => {
  const [dd, mm, yy] = d.split('/');
  return new Date(Date.UTC(+yy, +mm - 1, +dd, 17, 0)).toISOString();
};

async function fetchText(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

function parseResults(html: string, team: string) {
  const start = html.indexOf('<tbody>', html.indexOf('team-result'));
  if (start < 0) return [];
  const body = html.slice(start, html.indexOf('</tbody>', start));
  const rows = body.split('<tr>').slice(1);
  const out: any[] = [];
  let i = 0;
  for (const r of rows) {
    const date = (r.match(/team-result__date">\s*([\d/]+)/) || [])[1];
    const oppSlug = (r.match(/\/teams\/([a-z0-9\-]+)\/profile/) || [])[1];
    const oppName = deent(clean((r.match(/team-meta__name">\s*<a[^>]*>\s*([^<]+?)\s*<\/a>/) || [])[1] || ''));
    const wl = clean((r.match(/team-result__score">\s*([WL])\s*</) || [])[1] || '');
    const score = r.match(/team-result__score">\s*([\d]+)\s*-\s*([\d]+)\s*<\/td>/);
    const status = clean((r.match(/team-result__status">\s*(Home|Away)/) || [])[1] || '');
    const cat = clean((r.match(/team-result__points">\s*([^<]+?)\s*<\/td>/) || [])[1] || '');
    if (!date || !score) continue;
    const a = +score[1], b = +score[2];
    const home = status === 'Home';
    out.push({
      id: `r-${team}-${i++}`, team, datetime: isoFromGr(date), opponent: oppName,
      opponentLogo: teamLogo(oppSlug), home, scoreFor: home ? a : b, scoreAgainst: home ? b : a,
      won: wl === 'W', category: cat, recapUrl: '',
    });
  }
  return out;
}

function parseStandingsAll(html: string, ourName: string) {
  const headerRe = /card__header">\s*<h4 class="noCap">([^<]+)<\/h4>/g;
  const headers = [...html.matchAll(headerRe)].map((m) => ({ title: clean(deent(m[1])), index: m.index! }));
  const tableStarts: number[] = [];
  const tRe = /<table/g; let tm;
  while ((tm = tRe.exec(html))) tableStarts.push(tm.index);
  const tables: any[] = [];
  for (const h of headers) {
    if (h.title === 'Υπόμνημα') continue;
    const tIdx = tableStarts.find((idx) => idx > h.index);
    if (tIdx == null) continue;
    const chunk = html.slice(tIdx, html.indexOf('</table>', tIdx));
    if (!chunk.includes('team-standings__pos')) continue;
    const rows = chunk.split(/<tr/).slice(1);
    const table: any[] = [];
    for (const r of rows) {
      const name = deent(clean((r.match(/team-meta__name">\s*<a[^>]*>\s*([^<]+?)\s*<\/a>/) || [])[1] || ''));
      if (!name) continue;
      const slug = (r.match(/\/teams\/([a-z0-9\-]+)\/profile/) || [])[1];
      const pos = +((r.match(/team-standings__pos[^>]*>[\s\S]*?>(\d+)<\/div>/) || [])[1] || 0);
      const gb = [...r.matchAll(/team-standings__gb">\s*(\d+)\s*</g)].map((m) => +m[1]);
      const win = +((r.match(/team-standings__win">\s*(\d+)/) || [])[1] || 0);
      const lose = +((r.match(/team-standings__lose">\s*(\d+)/) || [])[1] || 0);
      const pf = +((r.match(/team-standings__home">\s*(\d+)/) || [])[1] || 0);
      const pa = +((r.match(/team-standings__road">\s*(\d+)/) || [])[1] || 0);
      table.push({ pos, team: name, logo: teamLogo(slug), played: gb[1] ?? 0, wins: win, losses: lose, pointsFor: pf, pointsAgainst: pa, points: gb[0] ?? 0, isOurs: name.includes(ourName) });
    }
    if (table.length) tables.push({ id: slugify(h.title), label: h.title, rows: table });
  }
  return tables;
}

function parseRoster(html: string, team: string) {
  const start = html.indexOf('<tbody>');
  if (start < 0) return [];
  const body = html.slice(start, html.indexOf('</tbody>', start));
  const rows = body.split('<tr>').slice(1);
  const out: any[] = [];
  for (const r of rows) {
    const slug = (r.match(/href="\/players\/([a-z0-9\-]+)"/i) || [])[1];
    const name = (r.match(/team-roster-table__name">\s*<a[^>]*>\s*([^<]+?)\s*<\/a>/i) || [])[1];
    if (!slug || !name) continue;
    const nums = [...r.matchAll(/team-roster-table__number[^>]*>\s*([\d.]+)\s*<\/td>/gi)].map((m) => +m[1]);
    out.push({
      id: `p-${team}-${slug}`, team, slug, name: clean(name),
      photo: `https://basketaki-web.b-cdn.net/players/${slug}.png`,
      games: nums[0] ?? 0, points: nums[4] ?? 0, ppg: nums[5] ?? 0,
    });
  }
  return out.sort((a, b) => (b.ppg ?? 0) - (a.ppg ?? 0));
}

function parseTeamStats(html: string) {
  const vals = [...html.matchAll(/team-stats__value">\s*(\d+)\s*</g)].map((m) => +m[1]);
  // order on the profile: scored, conceded, wins, losses
  return { pointsFor: vals[0] ?? 0, pointsAgainst: vals[1] ?? 0, wins: vals[2] ?? 0, losses: vals[3] ?? 0 };
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const rows: { team: string; collection: string; payload: unknown }[] = [];
  for (const t of TEAMS) {
    const [profile, results, standings, roster] = await Promise.all([
      fetchText(`${BASE}/${t.slug}/profile`),
      fetchText(`${BASE}/${t.slug}/results`),
      fetchText(`${BASE}/${t.slug}/standings`),
      fetchText(`${BASE}/${t.slug}/roster`),
    ]);
    const standAll = parseStandingsAll(standings, t.name);
    const current = standAll.find((tb) => tb.rows.some((r: any) => r.isOurs)) || standAll[0] || { rows: [] };
    rows.push(
      { team: t.key, collection: 'results', payload: parseResults(results, t.key) },
      { team: t.key, collection: 'standings', payload: current.rows },
      { team: t.key, collection: 'standings_history', payload: standAll },
      { team: t.key, collection: 'roster', payload: parseRoster(roster, t.key) },
      { team: t.key, collection: 'stats', payload: parseTeamStats(profile) },
    );
  }

  const { error } = await supabase.from('content').upsert(
    rows.map((r) => ({ team: r.team, collection: r.collection, payload: r.payload, updated_at: new Date().toISOString() })),
    { onConflict: 'team,collection' },
  );
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  await supabase.from('meta').upsert({ id: 'last_sync', value: { at: new Date().toISOString() }, updated_at: new Date().toISOString() });

  return new Response(JSON.stringify({ ok: true, upserted: rows.length }), { headers: { 'Content-Type': 'application/json' } });
});
