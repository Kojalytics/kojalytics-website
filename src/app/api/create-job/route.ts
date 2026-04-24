import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const PLAN_PORTRAITS = { starter: 12, premium: 24 } as const;
type Plan = keyof typeof PLAN_PORTRAITS;

export async function POST(request: NextRequest) {
  try {
    // 1. Require authenticated user — previously this route was open to the world.
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const promptCount = Array.isArray(body.prompts) ? body.prompts.length : 0;

    // Whitelist the only valid sizes up front: 3 (preview), 12 (starter), 24
    // (premium). An attacker with a JWT could otherwise spam thousands of
    // prompts to drain our Gemini quota.
    const VALID_COUNTS = new Set([3, 12, 24]);
    if (!VALID_COUNTS.has(promptCount)) {
      return NextResponse.json({ error: 'Invalid prompt count' }, { status: 400 });
    }

    // Also bound each prompt string length so the model input stays sane.
    for (const p of body.prompts) {
      if (typeof p?.prompt !== 'string' || p.prompt.length > 2000) {
        return NextResponse.json({ error: 'Invalid prompt content' }, { status: 400 });
      }
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const isPreview = promptCount === 3;

    // 2. For full-generation jobs, claim a purchase up-front. If nothing is claimed,
    //    the user has not paid (or redeemed a full-discount coupon) → 402.
    let purchaseId: string | null = null;
    let plan: Plan | null = null;
    if (!isPreview) {
      const { data: consumed, error: consumeErr } = await admin.rpc('consume_purchase', {
        p_user_id: user.id,
      });
      if (consumeErr) {
        const msg = consumeErr.message || '';
        if (msg.includes('NO_UNUSED_PURCHASE')) {
          return NextResponse.json({ error: 'payment_required' }, { status: 402 });
        }
        console.error('consume_purchase error:', consumeErr);
        return NextResponse.json({ error: 'Entitlement check failed' }, { status: 500 });
      }
      const row = Array.isArray(consumed) ? consumed[0] : consumed;
      if (!row) {
        return NextResponse.json({ error: 'payment_required' }, { status: 402 });
      }
      purchaseId = row.purchase_id;
      plan = row.plan as Plan;

      // Enforce that the client's requested portrait count matches the plan's entitlement.
      if (promptCount !== PLAN_PORTRAITS[plan]) {
        // Roll back the consume — the user still has a valid entitlement to claim later.
        await admin.from('purchases').update({
          status: 'unused', job_id: null, consumed_at: null,
        }).eq('id', purchaseId);
        return NextResponse.json(
          { error: 'plan_mismatch', expected: PLAN_PORTRAITS[plan], received: promptCount },
          { status: 400 },
        );
      }
    }

    // 3. Create the job via Edge Function. Forward the authenticated user_id
    //    so generation_jobs.user_id is stamped correctly and RLS can enforce
    //    read-own-jobs. Never trust body.userId from the client.
    const createRes = await fetch(`${SUPABASE_URL}/functions/v1/create-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
      },
      body: JSON.stringify({ ...body, userId: user.id }),
    });
    const createData = await createRes.json();

    if (!createRes.ok || !createData.jobId) {
      // Rollback consumed purchase so the user can retry.
      if (purchaseId) {
        await admin.from('purchases').update({
          status: 'unused', job_id: null, consumed_at: null,
        }).eq('id', purchaseId);
      }
      return NextResponse.json(createData, { status: createRes.status || 500 });
    }

    const jobId = createData.jobId as string;

    // 4. Backfill the job_id on the consumed purchase for audit.
    if (purchaseId) {
      await admin.from('purchases').update({ job_id: jobId }).eq('id', purchaseId);
    }

    // 5. Trigger process-portrait workers (fire-and-forget via abort after handshake).
    const totalPortraits = promptCount;
    const concurrency = totalPortraits <= 12 ? 3 : totalPortraits <= 24 ? 4 : 5;
    const workersToStart = Math.min(concurrency, totalPortraits);

    const workerTriggers = [];
    for (let i = 0; i < workersToStart; i++) {
      const controller = new AbortController();
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
          .then(() => { clearTimeout(timeout); return { worker: i, status: 'triggered' }; })
          .catch((err) => {
            clearTimeout(timeout);
            if (err.name === 'AbortError') return { worker: i, status: 'dispatched' };
            console.error(`Worker ${i} trigger failed:`, err);
            return { worker: i, status: 'failed', error: String(err) };
          }),
      );
    }
    await Promise.all(workerTriggers);

    return NextResponse.json(createData);
  } catch (err) {
    console.error('create-job proxy failed:', err);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
