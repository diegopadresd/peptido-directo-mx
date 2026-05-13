
-- Explicit deny policies to make the "server-only" intent obvious to the linter and to readers.
create policy "deny all anon orders"
  on public.orders for all to anon using (false) with check (false);
create policy "deny all auth orders"
  on public.orders for all to authenticated using (false) with check (false);
create policy "deny all anon order_items"
  on public.order_items for all to anon using (false) with check (false);
create policy "deny all auth order_items"
  on public.order_items for all to authenticated using (false) with check (false);
