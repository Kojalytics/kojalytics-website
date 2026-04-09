import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Create the job via Edge Function
    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // 2. Trigger process-portrait workers
    // Workers take 30+ seconds (AI generation), so we fire them and DON'T await responses.
    // We just need to ensure the HTTP requests leave before we return.
    const jobId = data.jobId;
    const totalPortraits = body.prompts?.length || 0;
    const concurrency = totalPortraits <= 12 ? 3 : totalPortraits <= 24 ? 4 : 5;
    const workersToStart = Math.min(concurrency, totalPortraits);

    for (let i = 0; i < workersToStart; i++) {
      fetch(`${SUPABASE_URL}/functions/v1/process-portrait`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'apikey': SERVICE_KEY,
        },
        body: JSON.stringify({ jobId, index: i }),
      }).catch((err) => {
        console.error(`Failed to trigger process-portrait worker ${i}:`, err);
      });
    }

    // Brief pause to ensure HTTP requests are dispatched before function terminates
    await new Promise(r => setTimeout(r, 2000));

    return NextResponse.json(data);
  } catch (err) {
    console.error('create-job proxy failed:', err);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
