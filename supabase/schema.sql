-- Run in Supabase SQL editor. Never expose service_role key in browser.
create extension if not exists pgcrypto;
create table if not exists public.staff_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('owner','branch_admin')),
 branch text check (branch in ('tuzla','ikitelli')),
 full_name text not null default '',
 created_at timestamptz not null default now(),
 constraint owner_branch check ((role='owner' and branch is null) or (role='branch_admin' and branch is not null))
);
create table if not exists public.quote_requests (
 id uuid primary key default gen_random_uuid(),
 branch text not null check (branch in ('tuzla','ikitelli')),
 company text not null check (length(trim(company)) between 1 and 120),
 contact text not null check (length(trim(contact)) between 6 and 120),
 items jsonb not null check (jsonb_typeof(items)='array' and jsonb_array_length(items) between 1 and 50),
 status text not null default 'new' check (status in ('new','reviewing','quoted','approved','completed','cancelled')),
 internal_note text not null default '',
 deleted_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.quote_audit (
 id bigint generated always as identity primary key,
 quote_id uuid not null references public.quote_requests(id),
 actor uuid references auth.users(id),
 action text not null,
 old_data jsonb,
 new_data jsonb,
 created_at timestamptz not null default now()
);
create or replace function public.staff_can_access(p_branch text)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.staff_profiles p where p.id=auth.uid() and (p.role='owner' or (p.role='branch_admin' and p.branch=p_branch)));
$$;
create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.staff_profiles p where p.id=auth.uid() and p.role='owner');
$$;
create or replace function public.can_manage_staff(p_branch text)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.staff_profiles p where p.id=auth.uid() and (p.role='owner' or (p.role='branch_admin' and p.branch=p_branch)));
$$;
alter table public.staff_profiles enable row level security;
alter table public.quote_requests enable row level security;
alter table public.quote_audit enable row level security;
revoke all on public.staff_profiles, public.quote_requests, public.quote_audit from anon;
grant select,insert,update on public.staff_profiles to authenticated;
grant select,update on public.quote_requests to authenticated;
grant select on public.quote_audit to authenticated;
create policy "staff read scoped" on public.staff_profiles for select to authenticated using (id=auth.uid() or public.is_owner() or (branch is not null and public.can_manage_staff(branch)));
create policy "staff add scoped" on public.staff_profiles for insert to authenticated with check (public.is_owner() or (role='branch_admin' and public.can_manage_staff(branch)));
create policy "staff update scoped" on public.staff_profiles for update to authenticated using (public.is_owner() or (branch is not null and public.can_manage_staff(branch))) with check (public.is_owner() or (role='branch_admin' and branch=(select p.branch from public.staff_profiles p where p.id=auth.uid())));
create policy "quotes read scoped" on public.quote_requests for select to authenticated using (public.staff_can_access(branch));
create policy "quotes update scoped" on public.quote_requests for update to authenticated using (public.staff_can_access(branch)) with check (public.staff_can_access(branch));
create policy "audit read scoped" on public.quote_audit for select to authenticated using (exists(select 1 from public.quote_requests q where q.id=quote_id and public.staff_can_access(q.branch)));
-- Prevent branch reassignment, edits to customer-supplied fields, and audit changes.
create or replace function public.protect_quote_update()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.branch is distinct from old.branch or new.company is distinct from old.company or new.contact is distinct from old.contact or new.items is distinct from old.items or new.created_at is distinct from old.created_at then
  raise exception 'Customer request fields cannot be changed from admin panel';
 end if;
 new.updated_at=now();
 insert into public.quote_audit(quote_id,actor,action,old_data,new_data)
 values(old.id,auth.uid(),'update',to_jsonb(old),to_jsonb(new));
 return new;
end; $$;
drop trigger if exists trg_protect_quote on public.quote_requests;
create trigger trg_protect_quote before update on public.quote_requests for each row execute function public.protect_quote_update();
-- Staff identities must first be created in Supabase Auth by an authorized operator.
-- Bootstrap owner profile from SQL editor ONLY, replacing the UUID with the Auth user ID:
-- insert into public.staff_profiles(id,role,branch,full_name) values ('YOUR_AUTH_USER_UUID','owner',null,'Ana Yönetici');
-- Public quote submission is intentionally disabled until a rate-limited, validated server endpoint is deployed.
