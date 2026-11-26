import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { findDiscount } from '@/lib/discounts';
import { LICENSE_DEVICES, LICENSE_PRODUCT } from '@/lib/license-sales';
import type { Plan } from '@/lib/pricing';
import { SITE_URL } from '@/lib/site';
import { CHECKOUT_BACK_PARAM, CHECKOUT_BACK_VALUE } from '@/lib/checkout-help';
import { discountError } from '@/lib/discount-text';
import { href, type Lang } from '@/lib/i18n';
import { PRICES, currencyFor } from '@/lib/currency';
import { OFFER_CODE, isOfferRunning } from '@/lib/offer';

const ALLOWED_ORIGINS = new Set(['https://www.kojalytics.com', 'https://kojalytics.com']);
// Local dev servers on any port (never a production redirect target: only this machine can open them).
const LOCAL_ORIGIN = /^http:\/\/localhost:\d{2,5}$/;

/*
 * The look of Stripe's checkout page, set per session (no dashboard setting needed): our name and K logo, white page,
 * square corners and the site's green buy colour. Stripe loads the pictures from these addresses when the page opens,
 * so they only show once they are live on www.kojalytics.com (public/checkout/).
 */
const BRANDING = {
  display_name: 'Kojalytics',
  logo: { type: 'url' as const, url: `${SITE_URL}/checkout/kojalytics-logo.png` },
  icon: { type: 'url' as const, url: `${SITE_URL}/checkout/kojalytics-icon.png` },
  background_color: '#ffffff',
  button_color: '#15803d',
  border_style: 'rectangular' as const,
};
const PRODUCT_IMAGE = `${SITE_URL}/checkout/koja-office-box.jpg`;

// Shown in Checkout right above the pay button (§ 312j (2) BGB): what, how long, how to end it.
function productText(plan: Plan, fromOffice: boolean, lang: Lang) {
  if (lang === 'en') {
    return {
      name: plan === 'monthly' ? 'Koja apps · Monthly' : fromOffice ? 'Koja Office 2026 · One-time purchase' : 'Koja apps · One-time purchase',
      description:
        plan === 'monthly'
          ? `All 13 Koja apps for Mac and Windows with free updates, on up to ${LICENSE_DEVICES} devices. Billed monthly and renews for one month at a time until you cancel. Cancel online at any time, effective at the end of the billing month.`
          : `All 13 Koja apps for Mac and Windows with free updates, on up to ${LICENSE_DEVICES} devices. One-time payment, no renewal, no expiry date.`,
    };
  }
  return {
    name: plan === 'monthly' ? 'Koja-Apps · Monatlich' : fromOffice ? 'Koja Office 2026 · Einmalkauf' : 'Koja-Apps · Einmalkauf',
    description:
      plan === 'monthly'
        ? `Alle 13 Koja-Apps für Mac und Windows mit kostenlosen Updates, auf bis zu ${LICENSE_DEVICES} Geräten. Läuft monatlich und verlängert sich jeweils um einen Monat, bis du kündigst. Jederzeit zum Ende des Abrechnungsmonats online kündbar.`
        : `Alle 13 Koja-Apps für Mac und Windows mit kostenlosen Updates, auf bis zu ${LICENSE_DEVICES} Geräten. Einmalzahlung, keine Verlängerung, ohne Ablaufdatum.`,
  };
}

export async function POST(request: NextRequest) {
  return checkout(request, await request.json().catch(() => ({})));
}

/*
 * A plain link straight into Checkout: the buy button in the bar of the browser apps (public/web/*\/index.html) opens
 * /api/license/checkout?lang=en and lands on Stripe's page right away, one-time purchase, with the running offer code.
 * On any error it goes to the prices on the home page instead.
 */
export async function GET(request: NextRequest) {
  const lang: Lang = request.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'de';
  const body = { plan: 'lifetime', lang, from: 'web' };
  let data = await (await checkout(request, isOfferRunning() ? { ...body, code: OFFER_CODE } : body)).json().catch(() => ({}));
  // The offer code no longer valid (ended, used up): Checkout at the regular price, with its own code field.
  if (typeof data?.url !== 'string' && isOfferRunning()) data = await (await checkout(request, body)).json().catch(() => ({}));
  const to = typeof data?.url === 'string' ? data.url : `${SITE_URL}${href(lang, '/#preise')}`;
  return NextResponse.redirect(to, 303);
}

async function checkout(request: NextRequest, body: { plan?: string; lang?: string; code?: string; from?: string }) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Stripe is not configured yet' }, { status: 503 });
  }
  const plan: Plan = body?.plan === 'monthly' ? 'monthly' : 'lifetime';
  // From the English pages (/en …): Checkout, its texts, the return pages and the license email in English.
  const lang: Lang = body?.lang === 'en' ? 'en' : 'de';
  // The currency of the page the visitor bought on: euros on the German pages, US dollars on the English ones.
  const cur = currencyFor(lang);

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // A discount code entered on the page: checked again here, then attached to the session (Stripe counts the use).
    let discount: { promotionCodeId: string; code: string } | null = null;
    if (body?.code) {
      const found = await findDiscount(stripe, body.code, cur);
      if (!found.ok) return NextResponse.json({ error: discountError(found.error, lang) }, { status: found.status });
      if (found.discount.prices[plan] === undefined) {
        return NextResponse.json({ error: discountError('Dieser Rabattcode gilt nicht für dieses Paket.', lang) }, { status: 400 });
      }
      discount = found.discount;
    }
    // Only our own domains as redirect targets (no open redirect).
    // A plain link (GET) sends no Origin header: then the address it was opened on counts.
    const rawOrigin = request.headers.get('origin') || request.nextUrl.origin;
    const origin = ALLOWED_ORIGINS.has(rawOrigin) || LOCAL_ORIGIN.test(rawOrigin) ? rawOrigin : SITE_URL;
    // koja_lang: the language of the license email (src/lib/license-sales.ts); missing or "de" means German.
    const metadata = { product: LICENSE_PRODUCT, koja_plan: plan, koja_lang: lang, koja_currency: cur, ...(discount ? { koja_code: discount.code } : {}) };
    // From the old ad landing page (/office, now the home page) or the browser apps: Checkout uses the Koja Office
    // product name, and "Back" returns to the home page with the code.
    const fromOffice = (body?.from === 'office' || body?.from === 'web') && plan === 'lifetime';
    const back = `${CHECKOUT_BACK_PARAM}=${CHECKOUT_BACK_VALUE}`;
    const product_data = { images: [PRODUCT_IMAGE], ...productText(plan, fromOffice, lang) };

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      line_items: [
        {
          price_data: {
            currency: cur.toLowerCase(),
            unit_amount: PRICES[cur][plan],
            product_data,
            ...(plan === 'monthly' ? { recurring: { interval: 'month' as const } } : {}),
          },
          quantity: 1,
        },
      ],
      ...(plan === 'monthly' ? { subscription_data: { metadata } } : {}),
      // A code from our page is attached here; otherwise Stripe's page shows its own discount code field.
      ...(discount ? { discounts: [{ promotion_code: discount.promotionCodeId }] } : { allow_promotion_codes: true }),
      // English: /en/thanks/start moves the session id into a cookie for /en/thanks, as /software/danke/start does.
      success_url: `${origin}${href(lang, '/software/danke')}/start?session_id={CHECKOUT_SESSION_ID}`,
      // "Zurück" on Stripe's page: the marker shows the "Noch unsicher?" box at the top (src/lib/checkout-help.ts).
      cancel_url: fromOffice
        ? `${origin}${href(lang, '/')}?${discount ? `code=${encodeURIComponent(discount.code)}&` : ''}${back}`
        : `${origin}${lang === 'en' ? href('en', '/') : '/software'}?${back}`,
      metadata,
      locale: lang,
      branding_settings: BRANDING,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('License checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
