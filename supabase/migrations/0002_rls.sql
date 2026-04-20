-- THE BOARD · harden orders table with RLS.
-- Server code uses the service_role key, which bypasses RLS by design.
-- Enabling RLS + deny-all is defence-in-depth: if the anon key ever leaks
-- to the client or a misconfigured request hits with anon, no rows are
-- readable/writable.

alter table orders enable row level security;

-- Explicit deny-all for anon and authenticated roles.
-- (No policy = deny under RLS, but declaring it makes intent obvious.)
drop policy if exists "orders_deny_anon_select" on orders;
create policy "orders_deny_anon_select" on orders
  for select to anon, authenticated
  using (false);

drop policy if exists "orders_deny_anon_insert" on orders;
create policy "orders_deny_anon_insert" on orders
  for insert to anon, authenticated
  with check (false);

drop policy if exists "orders_deny_anon_update" on orders;
create policy "orders_deny_anon_update" on orders
  for update to anon, authenticated
  using (false) with check (false);

drop policy if exists "orders_deny_anon_delete" on orders;
create policy "orders_deny_anon_delete" on orders
  for delete to anon, authenticated
  using (false);
