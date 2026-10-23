import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { LICENSE_DEVICES, LICENSE_PRODUCT } from '@/lib/license-sales';
import { PLANS, type Plan } from '@/lib/pricing';

const ALLOWED_ORIGINS = new Set(['https://www.kojalytics.com', 'https://kojalytics.com', 'http://localhost:3000', 'http://localhost:3100']);

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Stripe is not configured yet' }, { status: 503 });
  }
  const body = await request.json().catch(() => ({}));
  const plan: Plan = body?.plan === 'monthly' ? 'monthly' : 'lifetime';
  // The customer must have agreed that delivery starts now (§ 356 (5) BGB) before we take payment.
  if (body?.waiver !== true) {
    return NextResponse.json({ error: 'Please confirm the immediate start first.' }, { status: 400 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Only our own domains as redirect targets (no open redirect).
    const rawOrigin = request.headers.get('origin') || '';
    const origin = ALLOWED_ORIGINS.has(rawOrigin) ? rawOrigin : 'https://www.kojalytics.com';
    const metadata = { product: LICENSE_PRODUCT, koja_plan: plan, waiver_accepted_at: new Date().toISOString() };
    const product_data = {
      name: plan === 'monthly' ? 'Koja apps · Monthly' : 'Koja apps · Lifetime',
      description: `All 13 Koja apps for Mac on up to ${LICENSE_DEVICES} devices.`,
    };

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: PLANS[plan].cents,
            product_data,
            ...(plan === 'monthly' ? { recurring: { interval: 'month' as const } } : {}),
          },
          quantity: 1,
        },
      ],
      ...(plan === 'monthly' ? { subscription_data: { metadata } } : {}),
      success_url: `${origin}/software/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/software#pricing`,
      metadata,
      locale: 'en',
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('License checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
