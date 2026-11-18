-- Güneş Metal sipariş ve sevkiyat yönetimi
create table if not exists public.sales_orders (
 id uuid primary key default gen_random_uuid(),
 quote_id uuid not null unique references public.quote_requests(id) on delete restrict,
 branch text not null check(branch in ('tuzla','ikitelli')),
 company text not null,
 contact text not null,
 items jsonb not null default '[]'::jsonb,
 status text not null default 'received' check(status in ('received','preparing','cutting','ready','shipped','delivered','cancelled')),
 order_note text not null default '',
 shipment_company text not null default '',
 tracking_number text not null default '',
 vehicle_plate text not null default '',
 shipped_at timestamptz,
 delivered_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists sales_orders_branch_created_idx on public.sales_orders(branch,created_at desc);
alter table public.sales_orders enable row level security;
-- Use existing staff_profiles role and branch mapping; owner can access both branches.
drop policy if exists sales_orders_staff_select on public.sales_orders;
create policy sales_orders_staff_select on public.sales_orders for select to authenticated
using (exists(select 1 from public.staff_profiles s where s.id=auth.uid() and (s.role='owner' or s.branch=sales_orders.branch)));
drop policy if exists sales_orders_staff_insert on public.sales_orders;
create policy sales_orders_staff_insert on public.sales_orders for insert to authenticated
with check (exists(select 1 from public.staff_profiles s where s.id=auth.uid() and (s.role='owner' or s.branch=sales_orders.branch))
 and exists(select 1 from public.quote_requests q where q.id=quote_id and q.branch=sales_orders.branch and q.status='approved')
 and exists(select 1 from public.quote_prices p where p.quote_id=quote_id));
drop policy if exists sales_orders_staff_update on public.sales_orders;
create policy sales_orders_staff_update on public.sales_orders for update to authenticated
using (exists(select 1 from public.staff_profiles s where s.id=auth.uid() and (s.role='owner' or s.branch=sales_orders.branch)))
with check (exists(select 1 from public.staff_profiles s where s.id=auth.uid() and (s.role='owner' or s.branch=sales_orders.branch))
 and exists(select 1 from public.quote_requests q where q.id=quote_id and q.branch=sales_orders.branch));
create or replace function public.sales_orders_protect_fields()
returns trigger language plpgsql as $$
begin
 if (new.quote_id,new.branch,new.company,new.contact,new.items) is distinct from
    (old.quote_id,old.branch,old.company,old.contact,old.items) then
   raise exception 'Siparişin teklif, şube ve müşteri bilgileri değiştirilemez';
 end if;
 new.updated_at=now();
 return new;
end;$$;
drop trigger if exists sales_orders_protect_fields_trigger on public.sales_orders;
create trigger sales_orders_protect_fields_trigger before update on public.sales_orders
for each row execute function public.sales_orders_protect_fields();
