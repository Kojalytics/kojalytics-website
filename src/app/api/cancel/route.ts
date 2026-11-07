import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { LICENSE_PRODUCT, sendEmail } from '@/lib/license-sales';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Kündigungsbutton (§ 312k BGB): ends every active Koja subscription of this email address
// at the end of the paid period and confirms it by email. The answer is the same whether or not a
// subscription exists, so the form cannot be used to find out who is a customer.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const extraordinary = body?.type === 'extraordinary';
  const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 1000) : '';
  if (!EMAIL.test(email) || !name) {
    return NextResponse.json({ error: 'Bitte gib deinen Namen und die E-Mail-Adresse deines Abos ein.' }, { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Die Kündigung ist gerade nicht verfügbar. Bitte schreib an support@kojalytics.com.' }, { status: 503 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const customers = await stripe.customers.list({ email, limit: 10 });
    const ended: { id: string; endsAt: number }[] = [];
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'active', limit: 20 });
      for (const sub of subs.data) {
        if (sub.metadata?.product !== LICENSE_PRODUCT) continue;
        const updated = await stripe.subscriptions.update(sub.id, {
          cancel_at_period_end: true,
          metadata: { ...sub.metadata, cancelled_via: 'website', cancel_type: extraordinary ? 'extraordinary' : 'ordinary', cancel_reason: reason },
        });
        const endsAt = updated.items.data[0]?.current_period_end ?? updated.cancel_at ?? 0;
        ended.push({ id: sub.id, endsAt });
      }
    }

    if (ended.length && process.env.RESEND_API_KEY) {
      const until = ended
        .map((e) => new Date(e.endsAt * 1000).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }))
        .join(', ');
      await sendEmail(
        email,
        'Bestätigung deiner Kündigung',
        [
          `Hallo ${name},`,
          '',
          `wir haben deine Kündigung am ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })} Uhr erhalten.`,
          `Dein Koja-Apps-Abo endet am ${until}. Danach buchen wir nichts mehr ab.`,
          'Bis dahin kannst du die Apps weiter nutzen.',
          '',
          'Du möchtest doch bleiben? Unter https://www.kojalytics.com/software kannst du jederzeit wieder abonnieren.',
          '',
          'Kojalytics · https://www.kojalytics.com',
        ].join('\n')
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Cancel error:', err);
    return NextResponse.json({ error: 'Das hat nicht geklappt. Bitte versuche es erneut oder schreib an support@kojalytics.com.' }, { status: 500 });
  }
}
