create table spiritual_wisdom (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null default auth.uid(),
  content text not null,
  reference text,
  tags text[],
  created_at timestamp with time zone default now()
);

alter table spiritual_wisdom enable row level security;

create policy "Users can view their own wisdom"
  on spiritual_wisdom for select
  using (auth.uid() = user_id);

create policy "Users can insert their own wisdom"
  on spiritual_wisdom for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own wisdom"
  on spiritual_wisdom for update
  using (auth.uid() = user_id);

create policy "Users can delete their own wisdom"
  on spiritual_wisdom for delete
  using (auth.uid() = user_id);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
