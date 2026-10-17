// Creates license keys for the Koja apps and stores them (hashed) in Supabase.
//
//   node scripts/license/new-key.mjs --email kunde@example.com
//   node scripts/license/new-key.mjs --email kunde@example.com --devices 5 --note "Rechnung 1042"
//   node scripts/license/new-key.mjs --count 10 --note "Aktion Oktober"
//   node scripts/license/new-key.mjs --key KOJA-MEINE-EIGEN-ENSCH-LUSS1   (choose the key yourself)
//
// The key is shown only once: Supabase keeps a hash, not the key.
import { admin, formatKey, generateBody, hashKey, normalizeKey, parseArgs } from './lib.mjs';

const opts = parseArgs(process.argv.slice(2));
const count = Number(opts.count ?? 1);
const devices = Number(opts.devices ?? 3);
if (!Number.isInteger(count) || count < 1 || count > 500) throw new Error('--count must be 1 to 500');
if (!Number.isInteger(devices) || devices < 1) throw new Error('--devices must be 1 or more');

let bodies;
if (opts.key) {
  const body = normalizeKey(opts.key);
  if (!body) {
    throw new Error('--key must be KOJA- plus 20 characters from 0-9 and A-Z without I, L, O, U (e.g. KOJA-ABCDE-FGHJK-MNPQR-STVWX)');
  }
  if (count !== 1) throw new Error('--key and --count cannot be combined');
  bodies = [body];
} else {
  bodies = Array.from({ length: count }, generateBody);
}

const rows = bodies.map((body) => ({
  key_hash: hashKey(body),
  key_hint: body.slice(-5),
  email: opts.email ?? null,
  note: opts.note ?? null,
  max_devices: devices,
}));
const { error } = await admin().from('koja_licenses').insert(rows);
if (error) {
  throw new Error(error.code === '23505' ? 'This key already exists.' : `Supabase: ${error.message}`);
}

console.log(`${bodies.length} license key${bodies.length > 1 ? 's' : ''} (${devices} devices each)${opts.email ? ` for ${opts.email}` : ''}:\n`);
for (const body of bodies) console.log(formatKey(body));
