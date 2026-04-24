import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Requires JWT, filters by user_id. Previously unauthenticated — anyone could
// see the 5 most recent jobs company-wide.

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
  const { data: jobs } = await admin
    .from('generation_jobs')
    .select('id, status, total_portraits, completed_count, image_size, created_at, error_message')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return NextResponse.json({ jobs: jobs || [] });
}
