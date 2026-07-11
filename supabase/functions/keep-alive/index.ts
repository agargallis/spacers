// Supabase Edge Function: keep-alive
// A tiny weekly write so the free project never pauses for inactivity.
//
// Deploy:  supabase functions deploy keep-alive --no-verify-jwt
// Cron:    weekly (see SUPABASE_SETUP.md)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  await supabase.from('meta').upsert({
    id: 'heartbeat',
    value: { at: new Date().toISOString() },
    updated_at: new Date().toISOString(),
  });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
});
