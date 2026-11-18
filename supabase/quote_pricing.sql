-- Run once in Supabase SQL Editor after supabase/schema.sql.
-- Each request has one current pricing draft. Sending remains a manual action.
create table if not exists public.quote_prices (
 quote_id uuid primary key references public.quote_requests(id) on delete cascade,
 branch text not null check (branch in ('tuzla','ikitelli')),
 lines jsonb not null check (jsonb_typeof(lines)='array' and jsonb_array_length(lines) between 1 and 50),
 currency text not null default 'TRY' check (currency in ('TRY','USD','EUR')),
 vat_rate numeric(5,2) not null default 20 check (vat_rate between 0 and 100),
 delivery text not null default '' check (length(delivery)<=200),
 validity text not null default '' check (length(validity)<=200),
 remarks text not null default '' check (length(remarks)<=2000),
 updated_by uuid references auth.users(id),
 updated_at timestamptz not null default now()
);
alter table public.quote_prices enable row level security;
revoke all on public.quote_prices from anon;
grant select,insert,update on public.quote_prices to authenticated;
create policy "pricing read own branch" on public.quote_prices for select to authenticated using (public.staff_can_access(branch));
create policy "pricing insert own branch" on public.quote_prices for insert to authenticated with check (
 public.staff_can_access(branch) and
 exists(select 1 from public.quote_requests q where q.id=quote_id and q.branch=branch and q.deleted_at is null)
);
create policy "pricing update own branch" on public.quote_prices for update to authenticated using (public.staff_can_access(branch))
with check (public.staff_can_access(branch));
create or replace function public.validate_quote_price()
returns trigger language plpgsql security definer set search_path='' as $$
declare actual_branch text;
declare line jsonb;
begin
 select branch into actual_branch from public.quote_requests where id=new.quote_id and deleted_at is null;
 if actual_branch is null or new.branch<>actual_branch then raise exception 'Invalid quote branch'; end if;
 if tg_op='UPDATE' and (new.quote_id<>old.quote_id or new.branch<>old.branch) then raise exception 'Quote identity cannot change'; end if;
 for line in select value from jsonb_array_elements(new.lines) loop
  if jsonb_typeof(line) <> 'object'
    or jsonb_typeof(line->'quantity') <> 'number'
    or jsonb_typeof(line->'unit_price') <> 'number'
    or (line->>'quantity')::numeric <= 0 or (line->>'quantity')::numeric > 1000000
    or (line->>'unit_price')::numeric < 0 or (line->>'unit_price')::numeric > 1000000000
  then raise exception 'Invalid price line'; end if;
 end loop;
 new.updated_at=now();new.updated_by=auth.uid();
 return new;
end $$;
drop trigger if exists trg_validate_quote_price on public.quote_prices;
create trigger trg_validate_quote_price before insert or update on public.quote_prices
for each row execute function public.validate_quote_price();
