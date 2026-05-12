-- Feedback submissions table. Writes go through the service role
-- (server-only) so the user's email never appears on the public side.
-- Read access is restricted to the project owner via the Supabase dashboard.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  source text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);

alter table public.feedback enable row level security;

-- No public policies. Service role bypasses RLS; the project owner can
-- read submissions from the Supabase dashboard.
