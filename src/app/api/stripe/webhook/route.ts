import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 30;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Stripe is not configured yet' }, { status: 503 });
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET.includes('REPLACE')) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = session.metadata?.plan;
    const userId = session.metadata?.userId;

    if (!userId || !plan || (plan !== 'starter' && plan !== 'premium')) {
      console.error('Webhook: missing/invalid metadata', { sessionId: session.id, plan, userId });
      // Still return 200 so Stripe stops retrying — this is a bug in checkout creation, not a transient failure.
      return NextResponse.json({ received: true, warning: 'invalid metadata' });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { error } = await admin.from('purchases').insert({
      user_id: userId,
      plan,
      source: 'stripe',
      stripe_session_id: session.id,
    });

    // 23505 = unique_violation on stripe_session_id → idempotent retry, treat as success.
    if (error && error.code !== '23505') {
      console.error('Webhook: failed to insert purchase', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
