import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Fallback for the webhook: when the user lands on the success page we verify
// the session directly against the Stripe API and upsert the purchase row.
// Belt-and-suspenders with the async webhook — protects against webhook delay
// or delivery failure (and makes local dev work without stripe listen).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  try {
    // Authenticate the caller.
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { sessionId } = await request.json();
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'session_not_paid', status: session.payment_status }, { status: 402 });
    }

    const plan = session.metadata?.plan;
    const metaUserId = session.metadata?.userId;
    if (!plan || (plan !== 'starter' && plan !== 'premium')) {
      return NextResponse.json({ error: 'invalid_plan_metadata' }, { status: 400 });
    }
    if (metaUserId !== user.id) {
      // The caller is not the buyer — refuse to grant entitlement.
      return NextResponse.json({ error: 'user_mismatch' }, { status: 403 });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { error } = await admin.from('purchases').insert({
      user_id: user.id,
      plan,
      source: 'stripe',
      stripe_session_id: session.id,
    });

    // 23505 unique_violation → webhook already wrote it; still success from the user's perspective.
    if (error && error.code !== '23505') {
      console.error('confirm-session insert failed:', error);
      return NextResponse.json({ error: 'db_error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('confirm-session error:', err);
    return NextResponse.json({ error: 'confirm_failed' }, { status: 500 });
  }
}
