import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signCertificate } from '@/lib/license';
import { TRIAL_DAYS } from '@/lib/pricing';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// Ed25519 private key (PKCS#8 PEM), base64-encoded so it fits in one env line.
const SIGNING_KEY = process.env.LICENSE_SIGNING_PRIVATE_KEY;

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

/**
 * The license row that holds every machine's free trial as one activation each
 * (scripts/license/setup-trial-pool.mjs). Its key is never handed out; revoking it stops new trials.
 */
const TRIAL_POOL_NOTE = 'koja-trial-pool';

/**
 * POST { device, deviceName?, app?, version? } → the free trial of this machine, one per machine,
 * TRIAL_DAYS long from its first request.
 * → 200 { certificate, expires } while it runs
 * → 403 { error, certificate, expires } once it has ended (the launcher keeps the certificate, so
 *   the apps can say the trial is over)
 *
 * The certificate names the machine `trial_device`, not `device`: launchers and apps from before
 * trials never accept it as a license.
 */
export async function POST(request: NextRequest) {
  if (!SIGNING_KEY) {
    return NextResponse.json({ error: 'Der kostenlose Test ist gerade nicht verfügbar.' }, { status: 500 });
  }
  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : null);
  const device = str(input.device, 128);
  if (!device || !/^[0-9a-f]{64}$/.test(device)) {
    return NextResponse.json({ error: 'Invalid device.' }, { status: 400 });
  }

  const { data: pool, error } = await admin
    .from('koja_licenses')
    .select('id, revoked_at')
    .eq('note', TRIAL_POOL_NOTE)
    .order('created_at')
    .limit(1)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: 'License server error. Please try again later.' }, { status: 500 });
  }
  if (!pool || pool.revoked_at) {
    return NextResponse.json({ error: 'Der kostenlose Test ist gerade nicht verfügbar.' }, { status: 503 });
  }

  // first_seen keeps the start of this machine's trial: asking again only updates last_seen.
  const { error: upsertError } = await admin.from('koja_activations').upsert(
    {
      license_id: pool.id,
      device_hash: device,
      device_name: str(input.deviceName, 100),
      app: str(input.app, 40),
      app_version: str(input.version, 40),
      last_seen: new Date().toISOString(),
    },
    { onConflict: 'license_id,device_hash' },
  );
  const { data: row, error: readError } = await admin
    .from('koja_activations')
    .select('first_seen')
    .eq('license_id', pool.id)
    .eq('device_hash', device)
    .maybeSingle();
  if (upsertError || readError || !row?.first_seen) {
    return NextResponse.json({ error: 'License server error. Please try again later.' }, { status: 500 });
  }

  const now = Math.floor(Date.now() / 1000);
  const starts = Math.floor(new Date(row.first_seen).getTime() / 1000);
  const expires = starts + TRIAL_DAYS * 24 * 60 * 60;
  const certificate = signCertificate(
    { v: 1, trial: true, trial_device: device, starts, expires, issued: now },
    Buffer.from(SIGNING_KEY, 'base64').toString('utf8'),
  );
  if (now >= expires) {
    return NextResponse.json(
      { error: 'Dein kostenloser Test auf diesem Computer ist abgelaufen. Eine Lizenz bekommst du auf kojalytics.com.', certificate, expires },
      { status: 403 },
    );
  }
  return NextResponse.json({ certificate, expires });
}
