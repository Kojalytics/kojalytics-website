-- Licenses sold through Stripe: one per checkout session. The key is kept encrypted (AES-256-GCM,
-- key derived from LICENSE_SIGNING_PRIVATE_KEY) so the success page and the email can show it.
alter table public.koja_licenses add column if not exists stripe_session_id text unique;
alter table public.koja_licenses add column if not exists key_encrypted text;
alter table public.koja_licenses add column if not exists emailed_at timestamptz;

notify pgrst, 'reload schema';
