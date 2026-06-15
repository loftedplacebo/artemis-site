create table if not exists public.presale_contacts (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null unique,
  name text not null,
  email text not null,
  consent_to_email boolean not null default false,
  source text not null default 'presale-success',
  last_transaction_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists presale_contacts_email_idx
  on public.presale_contacts (email);

create index if not exists presale_contacts_updated_at_idx
  on public.presale_contacts (updated_at desc);
