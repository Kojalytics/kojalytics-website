import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { LICENSE_DEVICES, LICENSE_PRODUCT } from '@/lib/license-sales';
import { PLANS, type Plan } from '@/lib/pricing';

const ALLOWED_ORIGINS = new Set(['https://www.kojalytics.com', 'https://kojalytics.com', 'http://localhost:3000', 'http://localhost:3100', 'http://localhost:3101']);

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Stripe is not configured yet' }, { status: 503 });
  }
  const body = await request.json().catch(() => ({}));
  const plan: Plan = body?.plan === 'monthly' ? 'monthly' : 'lifetime';
  // Before we take payment the customer must have asked for delivery to start now (§ 356 (5) BGB)
  // and agreed separately that the apps are early versions (§ 327h BGB).
  if (body?.waiver !== true || body?.alpha !== true) {
    return NextResponse.json({ error: 'Bitte bestätige zuerst beide Punkte.' }, { status: 400 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Only our own domains as redirect targets (no open redirect).
    const rawOrigin = request.headers.get('origin') || '';
    const origin = ALLOWED_ORIGINS.has(rawOrigin) ? rawOrigin : 'https://www.kojalytics.com';
    const now = new Date().toISOString();
    const metadata = { product: LICENSE_PRODUCT, koja_plan: plan, waiver_accepted_at: now, alpha_accepted_at: now };
    // Shown in Checkout right above the pay button (§ 312j (2) BGB): what, how long, how to end it.
    const product_data = {
      name: plan === 'monthly' ? 'Koja-Apps · Monatlich' : 'Koja-Apps · Dauerhaft',
      description:
        plan === 'monthly'
          ? `Frühe Versionen (Alpha) aller 13 Koja-Apps für den Mac, auf bis zu ${LICENSE_DEVICES} Macs. Läuft monatlich und verlängert sich jeweils um einen Monat, bis du kündigst. Jederzeit zum Ende des Abrechnungsmonats online kündbar.`
          : `Frühe Versionen (Alpha) aller 13 Koja-Apps für den Mac, auf bis zu ${LICENSE_DEVICES} Macs. Einmalzahlung, keine Verlängerung, ohne Ablaufdatum.`,
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
      success_url: `${origin}/software/danke/start?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/software#preise`,
      metadata,
      locale: 'de',
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('License checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
