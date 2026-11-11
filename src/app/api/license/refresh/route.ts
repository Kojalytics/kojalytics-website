import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { refreshCertificate, type RefreshStore } from '@/lib/license';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// Ed25519 private key (PKCS#8 PEM), base64-encoded so it fits in one env line.
const SIGNING_KEY = process.env.LICENSE_SIGNING_PRIVATE_KEY;

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const store: RefreshStore = {
  async license(id) {
    // Not a uuid: no such license (Postgres would reject the comparison).
    if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
    const { data, error } = await admin.from('koja_licenses').select('id, key_hint, revoked_at').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async seen(licenseId, device, version) {
    const { data, error } = await admin
      .from('koja_activations')
      .update({ last_seen: new Date().toISOString(), ...(version ? { app_version: version } : {}) })
      .eq('license_id', licenseId)
      .eq('device_hash', device)
      .select('id');
    if (error) throw error;
    return (data ?? []).length > 0;
  },
};

/**
 * POST { certificate, version? }: the launcher renews its license certificate (daily, and at start).
 * → 200 { certificate, expires } while the key is valid and this device activated
 * → 403 { error } once the key was deactivated or the device removed: the launcher then deletes
 *   its certificate, so the apps lock
 * → 400 not a license certificate signed by Kojalytics
 */
export async function POST(request: NextRequest) {
  if (!SIGNING_KEY) {
    return NextResponse.json({ error: 'License renewal is not configured.' }, { status: 500 });
  }
  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (typeof input.certificate !== 'string' || input.certificate.length > 4096) {
    return NextResponse.json({ error: 'Invalid certificate.' }, { status: 400 });
  }
  const version = typeof input.version === 'string' ? input.version.slice(0, 40) : null;
  try {
    const answer = await refreshCertificate(
      input.certificate,
      version,
      Buffer.from(SIGNING_KEY, 'base64').toString('utf8'),
      store,
      Math.floor(Date.now() / 1000),
    );
    const { status, ...body } = answer;
    return NextResponse.json(body, { status });
  } catch (e) {
    console.error('License refresh failed', e);
    return NextResponse.json({ error: 'License server error. Please try again later.' }, { status: 500 });
  }
}
