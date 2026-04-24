import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Requires JWT and verifies the caller owns the job before returning status.
// Previously unauthenticated — anyone with a UUID could poll any user's job
// and download signed URLs from the response.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get('jobId');
    if (!jobId || !UUID_RE.test(jobId)) {
      return NextResponse.json({ error: 'Missing or invalid jobId' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    // Verify ownership — 404 (not 403) to avoid leaking which IDs exist.
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: job } = await admin
      .from('generation_jobs')
      .select('user_id')
      .eq('id', jobId)
      .single();

    if (!job || job.user_id !== user.id) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/get-job-status?job_id=${jobId}`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('get-job-status proxy failed:', err);
    return NextResponse.json({ error: 'Failed to get job status' }, { status: 500 });
  }
}
