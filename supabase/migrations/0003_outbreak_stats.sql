-- Auto-extracted outbreak stats snapshots. Each row is one extraction pass
-- across the latest articles. The most recent row is "current" and is what
-- the homepage reads. Older rows kept for audit / history.

create table if not exists public.outbreak_stats (
  id uuid primary key default gen_random_uuid(),
  cases_total int,
  deaths int,
  new_cases int,
  countries int,
  source_article_id uuid references public.articles(id) on delete set null,
  source_title text,
  source_url text,
  extracted_at timestamptz not null default now()
);

create index if not exists outbreak_stats_extracted_at_idx
  on public.outbreak_stats (extracted_at desc);

-- Public can read (the homepage uses anon to fetch current stats).
alter table public.outbreak_stats enable row level security;

drop policy if exists "outbreak_stats_public_read" on public.outbreak_stats;
create policy "outbreak_stats_public_read"
  on public.outbreak_stats
  for select
  to anon, authenticated
  using (true);
