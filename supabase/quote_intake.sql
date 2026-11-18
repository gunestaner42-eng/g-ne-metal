-- Apply in Supabase SQL Editor before enabling quote intake.
alter table public.quote_requests add column if not exists request_fingerprint text;
create unique index if not exists quote_requests_fingerprint_unique on public.quote_requests(request_fingerprint) where request_fingerprint is not null;
-- Keep existing RLS: only the server uses the service role to insert customer requests.
