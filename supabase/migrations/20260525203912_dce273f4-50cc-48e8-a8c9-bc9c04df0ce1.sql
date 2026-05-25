ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS ecartpay_session_id text,
  ADD COLUMN IF NOT EXISTS ecartpay_payment_id text,
  ADD COLUMN IF NOT EXISTS ecartpay_status_detail text;