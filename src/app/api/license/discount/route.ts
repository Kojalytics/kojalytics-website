import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { findDiscount } from '@/lib/discounts';
import { discountError } from '@/lib/discount-text';
import { clientIp, limiter } from '@/lib/form-guard';
import { currencyForRequest } from '@/lib/currency-server';

// Against guessing codes: at most 20 tries per IP address and hour (per server instance).
const tooMany = limiter(20);

/** POST { code, lang? } → the prices with this discount code, before checkout. lang "en": error messages in English. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const t = (message: string) => discountError(message, body?.lang === 'en' ? 'en' : 'de');
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: t('Rabattcodes sind gerade nicht verfügbar.') }, { status: 503 });
  }
  const ip = clientIp(request.headers);
  if (ip && tooMany(ip)) {
    return NextResponse.json({ error: t('Zu viele Versuche. Bitte versuche es in einer Stunde erneut.') }, { status: 429 });
  }
  try {
    // Prices in the visitor's currency, as on the page and in Checkout.
    const result = await findDiscount(new Stripe(process.env.STRIPE_SECRET_KEY), body?.code, currencyForRequest(request.headers));
    if (!result.ok) return NextResponse.json({ error: t(result.error) }, { status: result.status });
    const { code, label, duration, months, prices } = result.discount;
    return NextResponse.json({ code, label, duration, months, prices });
  } catch (err) {
    console.error('Discount lookup failed:', err);
    return NextResponse.json({ error: t('Der Code konnte gerade nicht geprüft werden. Bitte versuche es gleich noch einmal.') }, { status: 500 });
  }
}
