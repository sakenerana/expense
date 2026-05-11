-- Run this in Supabase SQL Editor (once).
-- This function updates BOTH auth.users.email and public."Users" profile fields safely.

create or replace function public.admin_update_user_email_and_profile(
  p_email text,
  p_first_name text,
  p_last_name text,
  p_middle_name text,
  p_role text,
  p_status text,
  p_user_uuid uuid
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not exists (
    select 1
    from public."Users" u
    where u.user_uuid = auth.uid()
      and u.role = 'Admin'
      and coalesce(u.status, 'Inactive') = 'Active'
  ) then
    raise exception 'Only active Admin users can update auth email/profile';
  end if;

  if p_user_uuid is null then
    raise exception 'p_user_uuid is required';
  end if;

  if p_email is null or length(trim(p_email)) = 0 then
    raise exception 'p_email is required';
  end if;

  update auth.users
  set email = lower(trim(p_email)),
      updated_at = now()
  where id = p_user_uuid;

  if not found then
    raise exception 'Auth user not found for id %', p_user_uuid;
  end if;

  update public."Users"
  set first_name = trim(p_first_name),
      middle_name = nullif(trim(coalesce(p_middle_name, '')), ''),
      last_name = trim(p_last_name),
      email = lower(trim(p_email)),
      role = p_role,
      status = p_status
  where user_uuid = p_user_uuid;

  if not found then
    raise exception 'Profile user not found for user_uuid %', p_user_uuid;
  end if;
end;
$$;

-- Allow authenticated app users to call it.
grant execute on function public.admin_update_user_email_and_profile(
  text, text, text, text, text, text, uuid
) to authenticated;
