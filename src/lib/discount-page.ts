import Stripe from 'stripe';
import { headers } from 'next/headers';
import { findDiscount } from '@/lib/discounts';
import { isOfferCode, isOfferRunning } from '@/lib/offer';
import { clientIp, limiter } from '@/lib/form-guard';
import type { Discount } from '@/lib/discount-store';

// A landing page checks its ad link's code on the server. Ads send many visitors with the same code, so each answer is
// kept for 5 minutes per server instance; the checkout checks the code again anyway.
const TTL_MS = 5 * 60_000;
const cache = new Map<string, { at: number; value: Discount | null }>();
// Codes not in the cache cost a Stripe call: at most 20 per IP address and hour, as in /api/license/discount.
const tooMany = limiter(20);

/** The discount for ?code= (or ?rabatt=) of a page request, or null for none, an invalid code or any trouble. */
export async function discountForPage(raw: string | string[] | undefined): Promise<Discount | null> {
  const code = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? '';
  const key = process.env.STRIPE_SECRET_KEY;
  if (!code || code.length > 64 || !key || key.includes('REPLACE')) return null;

  // The introductory code ends at its date, even while an earlier answer is still in the cache.
  if (isOfferCode(code) && !isOfferRunning()) return null;

  const hit = cache.get(code);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value;

  const ip = clientIp(await headers());
  if (ip && tooMany(ip)) return null;
  try {
    const found = await findDiscount(new Stripe(key), code);
    const value = found.ok
      ? { code: found.discount.code, label: found.discount.label, duration: found.discount.duration, months: found.discount.months, prices: found.discount.prices }
      : null;
    if (cache.size > 500) cache.clear();
    cache.set(code, { at: Date.now(), value });
    return value;
  } catch (err) {
    console.error('Discount lookup for page failed:', err);
    return null;
  }
}
