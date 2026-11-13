import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { findDiscount } from '@/lib/discounts';
import { LICENSE_DEVICES, LICENSE_PRODUCT } from '@/lib/license-sales';
import { PLANS, type Plan } from '@/lib/pricing';

const ALLOWED_ORIGINS = new Set(['https://www.kojalytics.com', 'https://kojalytics.com', 'http://localhost:3000', 'http://localhost:3100', 'http://localhost:3101']);

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Stripe is not configured yet' }, { status: 503 });
  }
  const body = await request.json().catch(() => ({}));
  const plan: Plan = body?.plan === 'monthly' ? 'monthly' : 'lifetime';

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // A discount code entered on the page: checked again here, then attached to the session (Stripe counts the use).
    let discount: { promotionCodeId: string; code: string } | null = null;
    if (body?.code) {
      const found = await findDiscount(stripe, body.code);
      if (!found.ok) return NextResponse.json({ error: found.error }, { status: found.status });
      if (found.discount.prices[plan] === undefined) {
        return NextResponse.json({ error: 'Dieser Rabattcode gilt nicht für dieses Paket.' }, { status: 400 });
      }
      discount = found.discount;
    }
    // Only our own domains as redirect targets (no open redirect).
    const rawOrigin = request.headers.get('origin') || '';
    const origin = ALLOWED_ORIGINS.has(rawOrigin) ? rawOrigin : 'https://www.kojalytics.com';
    const metadata = { product: LICENSE_PRODUCT, koja_plan: plan, ...(discount ? { koja_code: discount.code } : {}) };
    // Shown in Checkout right above the pay button (§ 312j (2) BGB): what, how long, how to end it.
    const product_data = {
      name: plan === 'monthly' ? 'Koja-Apps · Monatlich' : 'Koja-Apps · Dauerhaft',
      description:
        plan === 'monthly'
          ? `Frühe Versionen (Alpha) aller 13 Koja-Apps für Mac und Windows, auf bis zu ${LICENSE_DEVICES} Geräten. Läuft monatlich und verlängert sich jeweils um einen Monat, bis du kündigst. Jederzeit zum Ende des Abrechnungsmonats online kündbar.`
          : `Frühe Versionen (Alpha) aller 13 Koja-Apps für Mac und Windows, auf bis zu ${LICENSE_DEVICES} Geräten. Einmalzahlung, keine Verlängerung, ohne Ablaufdatum.`,
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
      ...(discount ? { discounts: [{ promotion_code: discount.promotionCodeId }] } : {}),
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
