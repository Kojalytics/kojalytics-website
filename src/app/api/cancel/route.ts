import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { LICENSE_PRODUCT, sendEmail } from '@/lib/license-sales';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORT = 'support@kojalytics.com';
// Subscriptions that bill now or can bill again.
const LIVE = new Set(['active', 'trialing', 'past_due', 'unpaid']);

// Best effort against misuse (per server instance): at most 3 declarations per address and hour.
const recent = new Map<string, number[]>();
function tooMany(email: string) {
  const now = Date.now();
  const hits = (recent.get(email) ?? []).filter((t) => now - t < 3_600_000);
  recent.set(email, [...hits, now]);
  return hits.length >= 3;
}

const day = (seconds: number) =>
  new Date(seconds * 1000).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' });

// Kündigungsbutton (§ 312k BGB): ends every Koja subscription of this e-mail address at the end of the paid
// period, confirms receipt to the address entered and sends a copy to support. The response is the same
// whether or not a subscription exists, so the form cannot be used to find out who is a customer.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const raw = typeof body?.email === 'string' ? body.email.trim() : '';
  const email = raw.toLowerCase();
  // Only name characters: the name is repeated in an e-mail to the address entered.
  const name = typeof body?.name === 'string' ? body.name.replace(/[^\p{L}\p{M} '-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  const extraordinary = body?.type === 'extraordinary';
  const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 1000) : '';
  const reference = typeof body?.reference === 'string' ? body.reference.trim().slice(0, 120) : '';
  if (!EMAIL.test(email) || !name) {
    return NextResponse.json({ error: 'Bitte gib deinen Namen und die E-Mail-Adresse deines Abos ein.' }, { status: 400 });
  }
  if (tooMany(email)) {
    return NextResponse.json({ error: 'Deine Kündigung ist bereits bei uns eingegangen. Bei Fragen schreib an support@kojalytics.com.' }, { status: 429 });
  }
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Die Kündigung ist gerade nicht verfügbar. Bitte schreib an support@kojalytics.com.' }, { status: 503 });
  }

  const receivedAt = new Date();
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Stripe compares e-mail addresses case-sensitively: look up the address as typed and in lower case.
    const lists = await Promise.all([...new Set([raw, email])].map((e) => stripe.customers.list({ email: e, limit: 10 })));
    const customerIds = [...new Set(lists.flatMap((l) => l.data.map((c) => c.id)))];
    const ends: number[] = [];
    for (const customer of customerIds) {
      const subs = await stripe.subscriptions.list({ customer, status: 'all', limit: 50 });
      for (const sub of subs.data) {
        if (sub.metadata?.product !== LICENSE_PRODUCT || !LIVE.has(sub.status)) continue;
        const current = sub.cancel_at_period_end
          ? sub
          : await stripe.subscriptions.update(sub.id, {
              cancel_at_period_end: true,
              metadata: { ...sub.metadata, cancelled_via: 'website', cancel_type: extraordinary ? 'extraordinary' : 'ordinary', cancel_reason: reason.slice(0, 450) },
            });
        ends.push(current.cancel_at ?? current.items.data[0]?.current_period_end ?? 0);
      }
    }

    const when = receivedAt.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'long', timeStyle: 'short' });
    const kind = extraordinary ? 'außerordentlich (aus wichtigem Grund)' : 'ordentlich, zum nächstmöglichen Zeitpunkt';
    const endDates = [...new Set(ends.filter(Boolean).map(day))].join(', ');
    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      const receipt = [
        `Hallo ${name},`,
        '',
        `wir haben deine Kündigung am ${when} Uhr erhalten.`,
        `Art der Kündigung: ${kind}`,
        '',
        ends.length
          ? `Dein Koja-Apps-Abo endet am ${endDates}. Danach buchen wir nichts mehr ab. Bis dahin kannst du die Apps weiter nutzen.`
          : 'Zu dieser E-Mail-Adresse haben wir kein laufendes Koja-Apps-Abo gefunden. Falls du mit einer anderen Adresse bezahlt hast, antworte bitte auf diese E-Mail. Wir ordnen deine Kündigung dann zu.',
        ...(extraordinary && ends.length ? ['Deine außerordentliche Kündigung prüfen wir und melden uns, falls das Abo früher enden soll.'] : []),
        '',
        'Bitte bewahre diese E-Mail auf.',
        'Kojalytics · https://www.kojalytics.com',
      ].join('\n');
      try {
        await sendEmail(raw, 'Eingangsbestätigung deiner Kündigung', receipt);
        emailSent = true;
      } catch (e) {
        console.error('Cancel: receipt email failed', e);
      }
      try {
        await sendEmail(
          SUPPORT,
          `Kündigung eingegangen: ${email}`,
          [`Eingang: ${when}`, `Name: ${name}`, `E-Mail: ${raw}`, `Art: ${kind}`, `Grund: ${reason || '–'}`, `Lizenz/Rechnung: ${reference || '–'}`, `Gefundene Abos: ${ends.length}${endDates ? ` (Ende ${endDates})` : ''}`, `Bestätigung gesendet: ${emailSent ? 'ja' : 'nein'}`].join('\n')
        );
      } catch (e) {
        console.error('Cancel: support copy failed', e);
      }
    }
    return NextResponse.json({ ok: true, receivedAt: receivedAt.toISOString(), emailSent });
  } catch (err) {
    console.error('Cancel error:', err);
    return NextResponse.json({ error: 'Das hat nicht geklappt. Bitte versuche es erneut oder schreib an support@kojalytics.com.' }, { status: 500 });
  }
}
