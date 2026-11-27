-- Customer reviews of Koja Office, shown on the home page (src/components/reviews). Only the service role reads or
-- writes this table: RLS is on and there are no policies. The public API returns published reviews without e-mail.

create table if not exists public.koja_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- The date shown with the review (the original date for imported reviews).
  reviewed_on date not null default current_date,
  name text not null check (char_length(name) between 1 and 60),
  -- Never shown publicly. Used to match a purchase and to contact the reviewer.
  email text,
  rating smallint not null check (rating between 1 and 5),
  title text check (char_length(title) <= 120),
  body text not null check (char_length(body) between 1 and 2000),
  lang text not null default 'de' check (lang in ('de', 'en')),
  -- pending: waits for the admin; published: on the site; hidden: taken off the site.
  status text not null default 'pending' check (status in ('pending', 'published', 'hidden')),
  -- Set by the admin: "Verifizierter Kauf" badge on the site.
  verified boolean not null default false,
  -- Set automatically: the e-mail belongs to a licence bought on kojalytics.com (a hint for the admin).
  purchase_match boolean not null default false,
  -- website, or where an imported review comes from (e.g. "E-Mail an den Support").
  source text not null default 'website' check (char_length(source) between 1 and 60)
);

create index if not exists koja_reviews_status_idx on public.koja_reviews (status, reviewed_on desc);
create index if not exists koja_reviews_email_idx on public.koja_reviews (lower(email));

alter table public.koja_reviews enable row level security;
