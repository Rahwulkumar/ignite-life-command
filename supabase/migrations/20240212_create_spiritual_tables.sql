-- Create spiritual_characters table
create table if not exists public.spiritual_characters (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  role text, -- 'King', 'Prophet', 'Apostle', etc.
  testament text, -- 'Old', 'New'
  cover_image text,
  notion_folder_id uuid references public.office_notes(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.spiritual_characters enable row level security;

-- Create policies
create policy "Enable read access for all users"
on public.spiritual_characters for select
using (true);

create policy "Enable insert for authenticated users only"
on public.spiritual_characters for insert
to authenticated
with check (true);

create policy "Enable update for authenticated users only"
on public.spiritual_characters for update
to authenticated
using (true);
