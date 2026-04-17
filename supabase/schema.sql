-- motionBoard schema
-- Run this in Supabase SQL editor

create table if not exists contests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand text not null,
  description text not null,
  prize text not null,
  deadline date not null,
  category text not null check (category in ('Ad', 'Social', 'Cinematic', 'Music Video', 'Short Film', 'Other')),
  source_platform text not null check (source_platform in ('Twitter', 'YouTube', 'Instagram', 'Reddit', 'Website')),
  source_url text not null,
  thumbnail_url text,
  featured boolean default false,
  status text default 'open' check (status in ('open', 'closed')),
  submitted_by text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table contests enable row level security;

-- Anyone can read approved contests
create policy "Public can read approved contests"
  on contests for select
  using (approved = true);

-- Authenticated users (admin) can read everything
create policy "Auth users can read all contests"
  on contests for select
  to authenticated
  using (true);

-- Anyone can submit (approved defaults to false — goes to pending queue)
create policy "Anyone can submit a contest"
  on contests for insert
  with check (approved = false);

-- Only authenticated users (admin) can update (approve, feature, close)
create policy "Auth users can update"
  on contests for update
  to authenticated
  using (true);

-- Indexes
create index contests_approved_status on contests (approved, status);
create index contests_featured on contests (featured) where featured = true;
create index contests_created_at on contests (created_at desc);
