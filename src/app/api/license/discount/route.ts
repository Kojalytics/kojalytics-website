import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { findDiscount } from '@/lib/discounts';
import { clientIp, limiter } from '@/lib/form-guard';

// Against guessing codes: at most 20 tries per IP address and hour (per server instance).
const tooMany = limiter(20);

/** POST { code } → the prices with this discount code, before checkout. */
export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Rabattcodes sind gerade nicht verfügbar.' }, { status: 503 });
  }
  const ip = clientIp(request.headers);
  if (ip && tooMany(ip)) {
    return NextResponse.json({ error: 'Zu viele Versuche. Bitte versuche es in einer Stunde erneut.' }, { status: 429 });
  }
  const body = await request.json().catch(() => ({}));
  try {
    const result = await findDiscount(new Stripe(process.env.STRIPE_SECRET_KEY), body?.code);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    const { code, label, duration, months, prices } = result.discount;
    return NextResponse.json({ code, label, duration, months, prices });
  } catch (err) {
    console.error('Discount lookup failed:', err);
    return NextResponse.json({ error: 'Der Code konnte gerade nicht geprüft werden. Bitte versuche es gleich noch einmal.' }, { status: 500 });
  }
}
