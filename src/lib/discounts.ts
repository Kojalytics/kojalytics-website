import type Stripe from 'stripe';
import { PLANS, type Plan } from '@/lib/pricing';

/**
 * Discount codes for the Koja-Apps are Stripe promotion codes (Stripe Dashboard → Produktkatalog → Gutscheine).
 * Stripe enforces "max. Einlösungen" and the expiry date; we read the code here to show the new price before
 * checkout and attach it to the Checkout Session.
 *
 * Which plans a code is for: coupon metadata `koja_plans` = "lifetime", "monthly" or "lifetime,monthly"
 * (without it: both). For the monthly plan the coupon's duration decides how many months are reduced.
 */
export type Discount = {
  code: string;
  promotionCodeId: string;
  /** "−50 %" or "−10,00 €" */
  label: string;
  duration: Stripe.Coupon.Duration;
  months: number | null;
  /** Price in cents with the code, for each plan the code applies to. */
  prices: Partial<Record<Plan, number>>;
};

export type DiscountLookup = { ok: true; discount: Discount } | { ok: false; status: number; error: string };

const euro = (cents: number) => (cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

export async function findDiscount(stripe: Stripe, raw: unknown): Promise<DiscountLookup> {
  const code = typeof raw === 'string' ? raw.trim() : '';
  if (!code || code.length > 64) return { ok: false, status: 400, error: 'Bitte gib einen Rabattcode ein.' };

  const { data } = await stripe.promotionCodes.list({ code, limit: 1, expand: ['data.promotion.coupon'] });
  const promo = data[0];
  if (!promo) return { ok: false, status: 404, error: 'Diesen Rabattcode gibt es nicht.' };
  if (promo.max_redemptions !== null && promo.times_redeemed >= promo.max_redemptions) {
    return { ok: false, status: 409, error: 'Dieser Rabattcode wurde schon eingelöst.' };
  }
  const coupon = promo.promotion.coupon;
  const expired = promo.expires_at !== null && promo.expires_at * 1000 < Date.now();
  if (!promo.active || expired || !coupon || typeof coupon === 'string' || !coupon.valid) {
    return { ok: false, status: 410, error: 'Dieser Rabattcode ist nicht mehr gültig.' };
  }

  const plans = (coupon.metadata?.koja_plans || 'lifetime,monthly').split(',').map((p) => p.trim()) as Plan[];
  const prices: Partial<Record<Plan, number>> = {};
  for (const plan of plans) {
    if (!(plan in PLANS)) continue;
    const full = PLANS[plan].cents;
    if (coupon.percent_off) prices[plan] = Math.round((full * (100 - coupon.percent_off)) / 100);
    else if (coupon.amount_off && coupon.currency === 'eur') prices[plan] = Math.max(0, full - coupon.amount_off);
  }
  if (!Object.keys(prices).length) return { ok: false, status: 410, error: 'Dieser Rabattcode ist nicht mehr gültig.' };

  return {
    ok: true,
    discount: {
      code: promo.code,
      promotionCodeId: promo.id,
      label: coupon.percent_off ? `−${coupon.percent_off.toLocaleString('de-DE')} %` : `−${euro(coupon.amount_off ?? 0)}`,
      duration: coupon.duration,
      months: coupon.duration_in_months,
      prices,
    },
  };
}
