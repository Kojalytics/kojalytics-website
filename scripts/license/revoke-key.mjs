// Revokes a license key: no new activations; devices already activated keep working offline.
//
//   node scripts/license/revoke-key.mjs KOJA-ABCDE-FGHJK-MNPQR-STVWX
import { admin, hashKey, normalizeKey, parseArgs } from './lib.mjs';

const [key] = parseArgs(process.argv.slice(2))._;
const body = key && normalizeKey(key);
if (!body) throw new Error('Usage: node scripts/license/revoke-key.mjs KOJA-XXXXX-XXXXX-XXXXX-XXXXX');

const { data, error } = await admin()
  .from('koja_licenses')
  .update({ revoked_at: new Date().toISOString() })
  .eq('key_hash', hashKey(body))
  .select('key_hint, email');
if (error) throw new Error(`Supabase: ${error.message}`);
if (!data.length) throw new Error('No license with this key.');
console.log(`Revoked …${data[0].key_hint}${data[0].email ? ` (${data[0].email})` : ''}.`);
