-- License keys for the Koja apps (Kojalytics Launcher, WordKoja, GridKoja, DeckKoja, ...).
-- Only the service role reads or writes these tables: RLS is on and there are no policies.

create table if not exists public.koja_licenses (
  id uuid primary key default gen_random_uuid(),
  -- SHA-256 (hex) of the normalized key; the key itself is never stored.
  key_hash text not null unique,
  -- Last group of the key, to recognise it in support requests.
  key_hint text not null,
  email text,
  note text,
  max_devices int not null default 3 check (max_devices > 0),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists public.koja_activations (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references public.koja_licenses (id) on delete cascade,
  -- SHA-256 (hex) the app computes from the machine's hardware id.
  device_hash text not null,
  device_name text,
  app text,
  app_version text,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  unique (license_id, device_hash)
);

create index if not exists koja_activations_license_id_idx on public.koja_activations (license_id);

alter table public.koja_licenses enable row level security;
alter table public.koja_activations enable row level security;
