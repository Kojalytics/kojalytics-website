import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

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

    // 2. Trigger process-portrait workers and WAIT for them to be accepted (HTTP response received)
    // We only wait for the HTTP connection to be established (not for generation to complete).
    // Each process-portrait call takes 30+ seconds, so we use AbortController to disconnect
    // after the request is accepted (5 second timeout for the HTTP handshake).
    const jobId = data.jobId;
    const totalPortraits = body.prompts?.length || 0;
    const concurrency = totalPortraits <= 12 ? 3 : totalPortraits <= 24 ? 4 : 5;
    const workersToStart = Math.min(concurrency, totalPortraits);

    const workerTriggers = [];
    for (let i = 0; i < workersToStart; i++) {
      const controller = new AbortController();
      // Give 5 seconds for the Edge Function to accept the request
      const timeout = setTimeout(() => controller.abort(), 5000);

      workerTriggers.push(
        fetch(`${SUPABASE_URL}/functions/v1/process-portrait`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'apikey': SERVICE_KEY,
          },
          body: JSON.stringify({ jobId, index: i }),
          signal: controller.signal,
        })
          .then(() => {
            clearTimeout(timeout);
            return { worker: i, status: 'triggered' };
          })
          .catch((err) => {
            clearTimeout(timeout);
            // AbortError is expected — means the request was sent but we didn't wait for response
            if (err.name === 'AbortError') {
              return { worker: i, status: 'dispatched' };
            }
            console.error(`Worker ${i} trigger failed:`, err);
            return { worker: i, status: 'failed', error: String(err) };
          })
      );
    }

    const results = await Promise.all(workerTriggers);
    console.log('Worker trigger results:', JSON.stringify(results));

    return NextResponse.json(data);
  } catch (err) {
    console.error('create-job proxy failed:', err);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
