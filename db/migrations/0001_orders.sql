-- THE BOARD · orders table
create extension if not exists "pgcrypto";

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  status text not null default 'pending',
  customer_first_name text not null,
  customer_last_name text not null,
  customer_phone text not null,
  customer_email text not null,
  np_city text not null,
  np_city_ref text not null,
  np_warehouse text not null,
  np_warehouse_ref text not null,
  np_delivery_type text not null, -- warehouse | postomat | pickup
  club_member_name text,
  product_sku text not null,
  product_variant text not null,
  quantity int not null default 1,
  total_amount int not null,
  mono_invoice_id text,
  comment text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_mono_invoice_id_idx on orders(mono_invoice_id);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);
