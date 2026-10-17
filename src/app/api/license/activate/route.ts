import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashKey, normalizeKey, signCertificate } from '@/lib/license';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// Ed25519 private key (PKCS#8 PEM), base64-encoded so it fits in one env line.
const SIGNING_KEY = process.env.LICENSE_SIGNING_PRIVATE_KEY;

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

/**
 * POST { key, device, deviceName?, app?, version? }
 * → 200 { certificate } | 400 bad input | 403 unknown or revoked key | 409 device limit reached
 */
export async function POST(request: NextRequest) {
  if (!SIGNING_KEY) {
    return NextResponse.json({ error: 'License activation is not configured.' }, { status: 500 });
  }
  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : null);
  const body = typeof input.key === 'string' ? normalizeKey(input.key) : null;
  const device = str(input.device, 128);
  if (!body) {
    return NextResponse.json({ error: 'This is not a valid license key.' }, { status: 400 });
  }
  if (!device || !/^[0-9a-f]{64}$/.test(device)) {
    return NextResponse.json({ error: 'Invalid device.' }, { status: 400 });
  }

  const { data: license, error } = await admin
    .from('koja_licenses')
    .select('id, key_hint, max_devices, revoked_at')
    .eq('key_hash', hashKey(body))
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: 'License server error. Please try again later.' }, { status: 500 });
  }
  if (!license || license.revoked_at) {
    return NextResponse.json({ error: 'This license key is not valid.' }, { status: 403 });
  }

  const { data: devices } = await admin.from('koja_activations').select('device_hash').eq('license_id', license.id);
  const known = (devices ?? []).some((d) => d.device_hash === device);
  if (!known && (devices ?? []).length >= license.max_devices) {
    return NextResponse.json(
      { error: `This key is already activated on ${license.max_devices} devices.` },
      { status: 409 },
    );
  }

  const now = new Date().toISOString();
  const { error: upsertError } = await admin.from('koja_activations').upsert(
    {
      license_id: license.id,
      device_hash: device,
      device_name: str(input.deviceName, 100),
      app: str(input.app, 40),
      app_version: str(input.version, 40),
      last_seen: now,
    },
    { onConflict: 'license_id,device_hash' },
  );
  if (upsertError) {
    return NextResponse.json({ error: 'License server error. Please try again later.' }, { status: 500 });
  }

  const certificate = signCertificate(
    { v: 1, license: license.id, hint: license.key_hint, device, issued: Math.floor(Date.now() / 1000) },
    Buffer.from(SIGNING_KEY, 'base64').toString('utf8'),
  );
  return NextResponse.json({ certificate });
}
