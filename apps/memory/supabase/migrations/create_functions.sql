
-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, username, full_name)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile for new users
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
