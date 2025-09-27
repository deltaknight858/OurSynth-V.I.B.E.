
-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Create profiles policies
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using ( true );

create policy "Users can insert their own profile"
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update their own profile"
    on profiles for update
    using ( auth.uid() = id );

-- Create notebooks table
create table if not exists public.notebooks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    user_id uuid references auth.users on delete cascade not null,
    color text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_modified timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notebooks enable row level security;

-- Create notebooks policies
create policy "Users can view their own notebooks"
    on notebooks for select
    using ( auth.uid() = user_id );

create policy "Users can create their own notebooks"
    on notebooks for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own notebooks"
    on notebooks for update
    using ( auth.uid() = user_id );

create policy "Users can delete their own notebooks"
    on notebooks for delete
    using ( auth.uid() = user_id );

-- Create function to automatically update last_modified
create or replace function update_last_modified_column()
returns trigger as $$
begin
    new.last_modified = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for notebooks last_modified
create trigger update_notebooks_last_modified
    before update on notebooks
    for each row
    execute function update_last_modified_column();

-- Create notes table
create table if not exists public.notes (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    content text,
    user_id uuid references auth.users on delete cascade not null,
    notebook_id uuid references notebooks on delete cascade not null,
    is_pinned boolean default false,
    tags text[],
    category text,
    attachments jsonb[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_modified timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notes enable row level security;

-- Create notes policies
create policy "Users can view their own notes"
    on notes for select
    using ( auth.uid() = user_id );

create policy "Users can create their own notes"
    on notes for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own notes"
    on notes for update
    using ( auth.uid() = user_id );

create policy "Users can delete their own notes"
    on notes for delete
    using ( auth.uid() = user_id );

-- Create trigger for notes last_modified
create trigger update_notes_last_modified
    before update on notes
    for each row
    execute function update_last_modified_column();

-- Create mind_maps table
create table if not exists public.mind_maps (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    user_id uuid references auth.users on delete cascade not null,
    notebook_id uuid references notebooks on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_modified timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for mind_maps
alter table public.mind_maps enable row level security;

-- Create mind_maps policies
create policy "Users can view their own mind maps"
    on mind_maps for select
    using ( auth.uid() = user_id );

create policy "Users can create their own mind maps"
    on mind_maps for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own mind maps"
    on mind_maps for update
    using ( auth.uid() = user_id );

create policy "Users can delete their own mind maps"
    on mind_maps for delete
    using ( auth.uid() = user_id );

-- Create trigger for mind_maps last_modified
create trigger update_mind_maps_last_modified
    before update on mind_maps
    for each row
    execute function update_last_modified_column();

-- Create mind_map_nodes table
create table if not exists public.mind_map_nodes (
    id uuid default gen_random_uuid() primary key,
    mind_map_id uuid references mind_maps on delete cascade not null,
    title text not null,
    content text,
    type text default 'default',
    position_x real default 0,
    position_y real default 0,
    linked_notes uuid[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_modified timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for mind_map_nodes
alter table public.mind_map_nodes enable row level security;

-- Create mind_map_nodes policies
create policy "Users can view nodes of their own mind maps"
    on mind_map_nodes for select
    using ( 
        exists (
            select 1 from mind_maps 
            where mind_maps.id = mind_map_nodes.mind_map_id 
            and mind_maps.user_id = auth.uid()
        )
    );

create policy "Users can create nodes in their own mind maps"
    on mind_map_nodes for insert
    with check ( 
        exists (
            select 1 from mind_maps 
            where mind_maps.id = mind_map_nodes.mind_map_id 
            and mind_maps.user_id = auth.uid()
        )
    );

create policy "Users can update nodes in their own mind maps"
    on mind_map_nodes for update
    using ( 
        exists (
            select 1 from mind_maps 
            where mind_maps.id = mind_map_nodes.mind_map_id 
            and mind_maps.user_id = auth.uid()
        )
    );

create policy "Users can delete nodes in their own mind maps"
    on mind_map_nodes for delete
    using ( 
        exists (
            select 1 from mind_maps 
            where mind_maps.id = mind_map_nodes.mind_map_id 
            and mind_maps.user_id = auth.uid()
        )
    );

-- Create trigger for mind_map_nodes last_modified
create trigger update_mind_map_nodes_last_modified
    before update on mind_map_nodes
    for each row
    execute function update_last_modified_column();

-- Create function to handle new user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user profile creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
