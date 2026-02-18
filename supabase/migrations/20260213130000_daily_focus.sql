create table daily_focus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  date date not null default current_date,
  reference text not null,
  content text not null,
  completed boolean not null default false,
  created_at timestamp with time zone default now(),
  unique(user_id, date)
);

alter table daily_focus enable row level security;

create policy "Users can view their own daily focus"
  on daily_focus for select
  using (auth.uid() = user_id);

create policy "Users can insert their own daily focus"
  on daily_focus for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own daily focus"
  on daily_focus for update
  using (auth.uid() = user_id);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
