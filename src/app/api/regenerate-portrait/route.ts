import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Re-runs a single portrait within an existing completed/processing job.
// Requires the caller to own the job. A per-portrait retry counter caps
// how many free regenerations a user can request (prevents abuse).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_REGENS_PER_PORTRAIT = 3;

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

    const { jobId, index } = await request.json();
    if (!jobId || !UUID_RE.test(jobId)) {
      return NextResponse.json({ error: 'Invalid jobId' }, { status: 400 });
    }
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= 100) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Ownership check.
    const { data: job } = await admin
      .from('generation_jobs')
      .select('user_id, total_portraits')
      .eq('id', jobId)
      .single();

    if (!job || job.user_id !== user.id) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    if (index >= job.total_portraits) {
      return NextResponse.json({ error: 'Index out of range' }, { status: 400 });
    }

    // Cap per-portrait regenerations to prevent abuse.
    const { data: portrait } = await admin
      .from('generation_portraits')
      .select('regen_count, status')
      .eq('job_id', jobId)
      .eq('index', index)
      .single();
    if (!portrait) return NextResponse.json({ error: 'Portrait not found' }, { status: 404 });

    const prevCount = portrait.regen_count || 0;
    if (prevCount >= MAX_REGENS_PER_PORTRAIT) {
      return NextResponse.json({ error: 'regen_limit' }, { status: 429 });
    }

    await admin
      .from('generation_portraits')
      .update({
        status: 'pending',
        storage_path: null,
        thumbnail_storage_path: null,
        completed_at: null,
        error_message: null,
        regen_count: prevCount + 1,
      })
      .eq('job_id', jobId)
      .eq('index', index);

    // If the job itself is already "completed", bump it back to "processing"
    // so get-job-status's self-heal + the client poll loop run again.
    await admin
      .from('generation_jobs')
      .update({ status: 'processing', completed_at: null })
      .eq('id', jobId);

    // Fire a worker — don't await, the client polls for completion anyway.
    fetch(`${SUPABASE_URL}/functions/v1/process-portrait`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
      },
      body: JSON.stringify({ jobId, index }),
    }).catch((err) => console.error('regenerate trigger failed:', err));

    return NextResponse.json({ ok: true, regen_count: prevCount + 1 });
  } catch (err) {
    console.error('regenerate-portrait error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
