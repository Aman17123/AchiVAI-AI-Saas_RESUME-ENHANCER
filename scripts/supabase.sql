-- =====================================================
-- AchiVAI — Supabase schema (run in SQL Editor)
-- =====================================================

-- Profiles (syncs with auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

-- Resumes
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text,
  template text,
  data jsonb not null default '{}',
  share_token text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  plan text default 'free',
  status text default 'active',
  razorpay_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Usage events (AI quota tracking)
create table if not exists usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  kind text default 'analysis',
  created_at timestamptz default now()
);

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  insert into public.subscriptions (user_id)
  values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================
-- Row Level Security
-- =====================================================
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_events enable row level security;

-- Users can read/write only their own rows
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "resumes_select_own" on public.resumes
  for select using (auth.uid() = user_id);
create policy "resumes_insert_own" on public.resumes
  for insert with check (auth.uid() = user_id);
create policy "resumes_update_own" on public.resumes
  for update using (auth.uid() = user_id);
create policy "resumes_delete_own" on public.resumes
  for delete using (auth.uid() = user_id);

create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "usage_select_own" on public.usage_events
  for select using (auth.uid() = user_id);
create policy "usage_insert_own" on public.usage_events
  for insert with check (auth.uid() = user_id);

-- Public: read a resume by share_token (for public share links)
create or replace function public.get_resume_by_token(token text)
returns jsonb
language sql
security definer set search_path = public
stable
as $$
  select data from resumes where share_token = token limit 1;
$$;