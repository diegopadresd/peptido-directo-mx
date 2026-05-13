
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending',
  total_mxn integer not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address jsonb not null,
  notes text,
  mp_preference_id text,
  mp_payment_id text
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  dose text not null,
  qty integer not null,
  unit_price_mxn integer not null,
  line_total_mxn integer not null
);

create index idx_order_items_order on public.order_items(order_id);
create index idx_orders_status on public.orders(status);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- No public select/insert/update/delete; only service-role server code touches these.
