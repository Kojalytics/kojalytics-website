import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { LICENSE_DEVICES, LICENSE_PRICE_CENTS, LICENSE_PRODUCT } from '@/lib/license-sales';

const ALLOWED_ORIGINS = new Set(['https://www.kojalytics.com', 'https://kojalytics.com', 'http://localhost:3000', 'http://localhost:3100']);

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Stripe is not configured yet' }, { status: 503 });
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Only our own domains as redirect targets (no open redirect).
    const rawOrigin = request.headers.get('origin') || '';
    const origin = ALLOWED_ORIGINS.has(rawOrigin) ? rawOrigin : 'https://www.kojalytics.com';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: LICENSE_PRICE_CENTS,
            product_data: {
              name: 'Kojalytics Lizenz – alle Koja-Apps',
              description: `Lebenslange Lizenz für WordKoja, GridKoja, DeckKoja und alle weiteren Koja-Apps, auf bis zu ${LICENSE_DEVICES} Geräten.`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/koja-apps/danke?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/koja-apps`,
      metadata: { product: LICENSE_PRODUCT },
      locale: 'de',
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('License checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
