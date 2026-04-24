import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Persists the user's marketing-email consent AFTER authentication — the
// AuthModal stores the intent in localStorage pre-magic-link; the app page
// flushes it here once a real session is available. Requires a valid JWT
// so consent can be tied to an actual user id (no anonymous opt-ins).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const optedIn = body.opted_in === true;
    const locale = typeof body.locale === 'string' ? body.locale.slice(0, 8) : null;
    const source = typeof body.source === 'string' ? body.source.slice(0, 32) : 'signup';

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const now = new Date().toISOString();

    await admin.from('user_marketing_preferences').upsert({
      user_id: user.id,
      marketing_opt_in: optedIn,
      opt_in_at: optedIn ? now : null,
      opt_out_at: optedIn ? null : now,
      locale,
      source,
    }, { onConflict: 'user_id' });

    return NextResponse.json({ ok: true, opted_in: optedIn });
  } catch (err) {
    console.error('marketing opt-in error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
