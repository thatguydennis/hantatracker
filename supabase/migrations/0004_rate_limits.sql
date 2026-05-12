-- Rate-limit bucket. One row per request hit. Counts within a window
-- are computed at read time. Old rows are pruned by the API route itself
-- before each check (cheap enough at our scale; no need for a job).
--
-- `client_key` is a salted SHA-256 of the client's IP so we never store
-- raw IPs.

create table if not exists public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  client_key text not null,
  route text not null,
  hit_at timestamptz not null default now()
);

create index if not exists rate_limits_key_route_hit_idx
  on public.rate_limits (client_key, route, hit_at desc);

create index if not exists rate_limits_hit_at_idx
  on public.rate_limits (hit_at);

-- Service-role-only — RLS denies anon access. Counts and inserts happen
-- in the API route which uses the service client.
alter table public.rate_limits enable row level security;
