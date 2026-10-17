// Shared helpers for the license scripts. Must match src/lib/license.ts.
import { createHash, randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

export const ENV_FILE = new URL('../../.env.local', import.meta.url);

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const BODY_LENGTH = 20;

export function readEnv() {
  const env = {};
  for (const line of readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

export function admin() {
  const env = readEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

export function normalizeKey(input) {
  let s = input.toUpperCase().replace(/[\s-]/g, '');
  if (s.startsWith('KOJA')) s = s.slice(4);
  s = s.replace(/O/g, '0').replace(/[IL]/g, '1');
  if (s.length !== BODY_LENGTH) return null;
  for (const c of s) if (!ALPHABET.includes(c)) return null;
  return s;
}

export function formatKey(body) {
  return 'KOJA-' + body.match(/.{5}/g).join('-');
}

export function generateBody() {
  let body = '';
  for (const b of randomBytes(BODY_LENGTH)) body += ALPHABET[b % 32];
  return body;
}

export function hashKey(body) {
  return createHash('sha256').update(body).digest('hex');
}

/** --name value pairs and bare positional arguments. */
export function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) opts[argv[i].slice(2)] = argv[++i];
    else opts._.push(argv[i]);
  }
  return opts;
}
