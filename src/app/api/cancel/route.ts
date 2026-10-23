import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { LICENSE_PRODUCT, sendEmail } from '@/lib/license-sales';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cancellation button (§ 312k BGB): ends every active Koja subscription of this email address
// at the end of the paid period and confirms it by email. The answer is the same whether or not a
// subscription exists, so the form cannot be used to find out who is a customer.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const extraordinary = body?.type === 'extraordinary';
  const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 1000) : '';
  if (!EMAIL.test(email) || !name) {
    return NextResponse.json({ error: 'Please enter your name and the email address you subscribed with.' }, { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
    return NextResponse.json({ error: 'Cancellation is temporarily unavailable. Please email support@kojalytics.com.' }, { status: 503 });
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
        .map((e) => new Date(e.endsAt * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))
        .join(', ');
      await sendEmail(
        email,
        'Your Koja subscription is cancelled',
        [
          `Hello ${name},`,
          '',
          `we have received your cancellation on ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/Berlin' })} (Berlin time).`,
          `Your Koja apps subscription ends on ${until}. You will not be charged again.`,
          'You can keep using the apps until then.',
          '',
          'Changed your mind? Subscribe again any time at https://www.kojalytics.com/software',
          '',
          'Kojalytics · https://www.kojalytics.com',
        ].join('\n')
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Cancel error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again or email support@kojalytics.com.' }, { status: 500 });
  }
}
