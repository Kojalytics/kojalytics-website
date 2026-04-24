import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Requires JWT. Ignores any client-supplied `uid` param and always lists the
// authenticated user's own folder. Previously this route was unauthenticated
// and accepted any uid, which let an attacker enumerate every user's selfies.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: files } = await admin.storage
    .from('reference-images')
    .list(user.id, { limit: 20, sortBy: { column: 'created_at', order: 'asc' } });

  const paths = (files || [])
    .filter(f => f.name && !f.name.startsWith('.'))
    .map(f => `${user.id}/${f.name}`);

  return NextResponse.json({ paths });
}
