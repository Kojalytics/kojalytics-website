import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

// Mints a short-lived token the desktop embeds in the QR-code URL so the
// unauthenticated mobile upload page can POST files that get attributed to
// the right user_id. Previously the mobile-upload endpoint trusted a raw
// `uid` query param, which let anyone who knew a UUID overwrite that user's
// selfies.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // 32 random bytes base64url-encoded = 43 chars; short enough to QR-encode.
  const uploadToken = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1h

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const { error } = await admin.from('mobile_upload_tokens').insert({
    token: uploadToken,
    user_id: user.id,
    expires_at: expiresAt,
  });

  if (error) {
    console.error('mobile-upload token mint failed:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }

  return NextResponse.json({ token: uploadToken, expires_at: expiresAt });
}
