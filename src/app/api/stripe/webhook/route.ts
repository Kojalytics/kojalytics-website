import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Stripe is not configured yet' }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { plan, jobId, userId, portraits } = session.metadata || {};

    console.log(`Payment successful: ${plan} plan, ${portraits} portraits, jobId: ${jobId}, userId: ${userId}`);

    // Here you can:
    // 1. Update the user's purchase status in Supabase
    // 2. Trigger full portrait generation
    // 3. Send confirmation email
    // For now, the frontend handles generation after redirect
  }

  return NextResponse.json({ received: true });
}
