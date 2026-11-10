// Creates the license row that holds the free trials (one activation per machine), once.
// The trial route (src/app/api/license/trial) finds it by its note. Its key is random and never
// shown, so nobody can activate it as a license. Revoke it (revoked_at) to stop new trials.
//
//   node scripts/license/setup-trial-pool.mjs
import { admin, generateBody, hashKey } from './lib.mjs';

const NOTE = 'koja-trial-pool';
const db = admin();
const { data: existing, error } = await db.from('koja_licenses').select('id, revoked_at').eq('note', NOTE);
if (error) throw new Error(`Supabase: ${error.message}`);
if (existing.length) {
  console.log(`Trial pool already exists (${existing.length} row${existing.length > 1 ? 's' : ''})${existing.some((r) => r.revoked_at) ? ', revoked' : ''}.`);
} else {
  const body = generateBody();
  const { error: insertError } = await db
    .from('koja_licenses')
    .insert({ key_hash: hashKey(body), key_hint: 'TRIAL', note: NOTE, max_devices: 1_000_000_000 });
  if (insertError) throw new Error(`Supabase: ${insertError.message}`);
  console.log('Trial pool created.');
}
