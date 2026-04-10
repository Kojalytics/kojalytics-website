import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

export async function POST(request: NextRequest) {
  try {
    const { code, plan, jobId } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code required' }, { status: 400 });
    }
    if (!plan || (plan !== 'starter' && plan !== 'premium')) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Authenticate the caller with their Supabase JWT
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

    // Atomic redeem via RPC (service role so it bypasses RLS)
    const { data, error } = await admin.rpc('redeem_coupon', {
      p_code: code.trim().toUpperCase(),
      p_user_id: user.id,
      p_plan: plan,
      p_job_id: jobId || null,
    });

    if (error) {
      const msg = error.message || '';
      if (msg.includes('COUPON_NOT_FOUND')) {
        return NextResponse.json({ error: 'invalid' }, { status: 404 });
      }
      if (msg.includes('COUPON_EXPIRED')) {
        return NextResponse.json({ error: 'expired' }, { status: 410 });
      }
      if (msg.includes('COUPON_EXHAUSTED')) {
        return NextResponse.json({ error: 'exhausted' }, { status: 409 });
      }
      console.error('redeem_coupon RPC error:', error);
      return NextResponse.json({ error: 'Redemption failed' }, { status: 500 });
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      return NextResponse.json({ error: 'invalid' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      discountPercent: row.discount_percent,
      remainingUses: row.remaining_uses,
    });
  } catch (err) {
    console.error('redeem-coupon error:', err);
    return NextResponse.json({ error: 'Failed to redeem coupon' }, { status: 500 });
  }
}
