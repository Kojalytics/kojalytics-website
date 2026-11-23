import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { findDiscount } from '@/lib/discounts';
import { LICENSE_DEVICES, LICENSE_PRODUCT } from '@/lib/license-sales';
import { PLANS, type Plan } from '@/lib/pricing';
import { SITE_URL } from '@/lib/site';
import { CHECKOUT_BACK_PARAM, CHECKOUT_BACK_VALUE, SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_HREF } from '@/lib/checkout-help';

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

// Short and plain, right above and below the pay button (Stripe renders a little Markdown: links and **bold**).
const link = (label: string, href: string) => `[${label}](${href})`;
const WITHDRAW = `14 Tage gesetzliches Widerrufsrecht (${link('so widerrufst du', `${SITE_URL}/widerrufen`)}).`;
const SUBMIT_TEXT: Record<Plan, string> = {
  lifetime: `Einmalzahlung, kein Abo. Deinen Lizenzschlüssel bekommst du sofort nach der Zahlung per E-Mail. ${WITHDRAW}`,
  monthly: `Monatlich, jederzeit zum Ende des Abrechnungsmonats online kündbar (${link('Abo kündigen', `${SITE_URL}/kuendigen`)}). Deinen Lizenzschlüssel bekommst du sofort nach der Zahlung per E-Mail. ${WITHDRAW}`,
};
const AFTER_SUBMIT_TEXT = `Fragen? ${link(SUPPORT_PHONE, SUPPORT_PHONE_HREF)} · ${link(SUPPORT_EMAIL, `mailto:${SUPPORT_EMAIL}`)} · Kojalytics, Hamburg`;

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
    const origin = ALLOWED_ORIGINS.has(rawOrigin) || LOCAL_ORIGIN.test(rawOrigin) ? rawOrigin : SITE_URL;
    const metadata = { product: LICENSE_PRODUCT, koja_plan: plan, ...(discount ? { koja_code: discount.code } : {}) };
    // From the ad landing page (/office): Checkout uses its product name, and "Back" returns there with the code.
    const fromOffice = body?.from === 'office' && plan === 'lifetime';
    const back = `${CHECKOUT_BACK_PARAM}=${CHECKOUT_BACK_VALUE}`;
    // Shown in Checkout right above the pay button (§ 312j (2) BGB): what, how long, how to end it.
    const product_data = {
      images: [PRODUCT_IMAGE],
      name: plan === 'monthly' ? 'Koja-Apps · Monatlich' : fromOffice ? 'Koja Office 2026 · Einmalkauf' : 'Koja-Apps · Einmalkauf',
      description:
        plan === 'monthly'
          ? `Alle 13 Koja-Apps für Mac und Windows mit kostenlosen Updates, auf bis zu ${LICENSE_DEVICES} Geräten. Läuft monatlich und verlängert sich jeweils um einen Monat, bis du kündigst. Jederzeit zum Ende des Abrechnungsmonats online kündbar.`
          : `Alle 13 Koja-Apps für Mac und Windows mit kostenlosen Updates, auf bis zu ${LICENSE_DEVICES} Geräten. Einmalzahlung, keine Verlängerung, ohne Ablaufdatum.`,
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
      // A code from our page is attached here; otherwise Stripe's page shows its own discount code field.
      ...(discount ? { discounts: [{ promotion_code: discount.promotionCodeId }] } : { allow_promotion_codes: true }),
      success_url: `${origin}/software/danke/start?session_id={CHECKOUT_SESSION_ID}`,
      // "Zurück" on Stripe's page: the marker shows the "Noch unsicher?" box at the top (src/lib/checkout-help.ts).
      cancel_url: fromOffice
        ? `${origin}/office?${discount ? `code=${encodeURIComponent(discount.code)}&` : ''}${back}`
        : `${origin}/software?${back}`,
      metadata,
      locale: 'de',
      branding_settings: BRANDING,
      custom_text: { submit: { message: SUBMIT_TEXT[plan] }, after_submit: { message: AFTER_SUBMIT_TEXT } },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('License checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
