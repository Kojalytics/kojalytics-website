import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { issueLicense } from '@/lib/license-sales';

/**
 * Digistore24 "Ihr Lizenzserver": Digistore24 calls this once per order of product 765994 (Koja Office) with the
 * order as POST fields (order_id, email, product_id, quantity, api_mode, address_first_name, …) and shows the key we
 * return on its order confirmation page and in its e-mail; we also send our own licence e-mail with the download steps.
 * The URL entered in Digistore24 carries the secret: /api/digistore/license?token=<DIGISTORE_LICENSE_TOKEN>.
 */
const PRODUCT_ID = '765994';

const fail = (message: string, status: number) => NextResponse.json({ status: 'error', message }, { status });

function sameSecret(given: string, secret: string) {
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function fields(request: NextRequest): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    if (key !== 'token') out[key] = value;
  });
  if (request.method !== 'POST') return out;
  if ((request.headers.get('content-type') ?? '').includes('application/json')) {
    const json = await request.json().catch(() => ({}));
    for (const [key, value] of Object.entries(json ?? {})) out[key] = String(value ?? '');
  } else {
    const form = await request.formData().catch(() => null);
    form?.forEach((value, key) => {
      if (typeof value === 'string') out[key] = value;
    });
  }
  return out;
}

async function handle(request: NextRequest) {
  const secret = process.env.DIGISTORE_LICENSE_TOKEN;
  if (!secret) return fail('not configured', 503);
  if (!sameSecret(request.nextUrl.searchParams.get('token') ?? '', secret)) return fail('forbidden', 403);

  const order = await fields(request);
  const orderId = (order.order_id ?? '').trim();
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(orderId)) return fail('invalid order', 400);
  if (order.product_id && order.product_id.trim() !== PRODUCT_ID) return fail('unknown product', 400);
  const test = order.api_mode === 'test';
  const name = [order.address_first_name, order.address_last_name].map((s) => s?.trim()).filter(Boolean).join(' ') || null;

  try {
    const license = await issueLicense({
      ref: `ds24:${orderId}`,
      email: order.email?.trim() || null,
      note: `Digistore24 ${orderId}${test ? ' (Testbestellung)' : ''}`,
      subscription: false,
      paidCents: null,
      name,
      date: new Date(),
    });
    return NextResponse.json({
      status: 'success',
      key: license.key,
      headline: 'Dein Koja-Office-Lizenzschlüssel',
      data: { Download: 'https://www.kojalytics.com/software', Geraete: 'bis zu 3 (Mac oder Windows-PC)' },
    });
  } catch (e) {
    console.error('Digistore24 licence failed', e);
    return fail('licence failed', 500);
  }
}

export const POST = handle;
export const GET = handle;
