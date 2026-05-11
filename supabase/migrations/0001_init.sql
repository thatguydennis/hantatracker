-- Hantavirus tracker schema.
-- Apply with: supabase db push   (after `supabase link --project-ref <ref>`)

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  title text not null,
  url text not null unique,
  summary text,
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  category text not null default 'news'
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

create index if not exists articles_source_idx
  on public.articles (source);

create table if not exists public.refresh_log (
  id uuid primary key default gen_random_uuid(),
  ran_at timestamptz not null default now(),
  articles_added int not null default 0,
  articles_skipped int not null default 0,
  errors jsonb
);

-- RLS: anon role can read articles (the frontend reads them publicly).
-- Service role bypasses RLS, so the cron endpoint can write freely.
alter table public.articles enable row level security;
alter table public.refresh_log enable row level security;

drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read"
  on public.articles
  for select
  to anon, authenticated
  using (true);
