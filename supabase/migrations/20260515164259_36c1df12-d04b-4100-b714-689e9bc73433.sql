
-- 1. Public RPC to upsert cart from the browser using cart_token (no auth required)
CREATE OR REPLACE FUNCTION public.cart_upsert(
  _cart_token text,
  _items jsonb,
  _subtotal_mxn integer,
  _email text DEFAULT NULL,
  _customer_name text DEFAULT NULL,
  _phone text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF _cart_token IS NULL OR length(_cart_token) = 0 OR length(_cart_token) > 80 THEN RETURN; END IF;
  IF _items IS NULL THEN RETURN; END IF;
  IF jsonb_typeof(_items) <> 'array' THEN RETURN; END IF;

  INSERT INTO public.carts (cart_token, items, subtotal_mxn, email, customer_name, phone, status, last_seen_at, updated_at)
  VALUES (
    _cart_token,
    _items,
    GREATEST(COALESCE(_subtotal_mxn, 0), 0),
    NULLIF(_email, ''),
    NULLIF(_customer_name, ''),
    NULLIF(_phone, ''),
    'active',
    now(),
    now()
  )
  ON CONFLICT (cart_token) DO UPDATE SET
    items = EXCLUDED.items,
    subtotal_mxn = EXCLUDED.subtotal_mxn,
    email = COALESCE(EXCLUDED.email, public.carts.email),
    customer_name = COALESCE(EXCLUDED.customer_name, public.carts.customer_name),
    phone = COALESCE(EXCLUDED.phone, public.carts.phone),
    status = CASE WHEN public.carts.status = 'converted' THEN 'converted' ELSE 'active' END,
    last_seen_at = now(),
    updated_at = now();
END $$;

-- Ensure cart_token is unique for upsert
CREATE UNIQUE INDEX IF NOT EXISTS carts_cart_token_unique ON public.carts(cart_token) WHERE cart_token IS NOT NULL;

GRANT EXECUTE ON FUNCTION public.cart_upsert(text, jsonb, integer, text, text, text) TO anon, authenticated;

-- 2. Extended dashboard summary with recent orders, top products, tracking health
CREATE OR REPLACE FUNCTION public.admin_dashboard_summary()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE result JSONB; _cutoff TIMESTAMPTZ;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  _cutoff := now() - interval '1 hour';

  SELECT jsonb_build_object(
    'revenue', jsonb_build_object(
      'd1',  COALESCE((SELECT SUM(total_mxn) FROM orders WHERE status='approved' AND created_at >= now() - interval '1 day'),0),
      'd7',  COALESCE((SELECT SUM(total_mxn) FROM orders WHERE status='approved' AND created_at >= now() - interval '7 days'),0),
      'd30', COALESCE((SELECT SUM(total_mxn) FROM orders WHERE status='approved' AND created_at >= now() - interval '30 days'),0)
    ),
    'counts', jsonb_build_object(
      'ordersTotal',    (SELECT COUNT(*)::int FROM orders),
      'ordersApproved', (SELECT COUNT(*)::int FROM orders WHERE status='approved'),
      'ordersPending',  (SELECT COUNT(*)::int FROM orders WHERE status='pending'),
      'cartsActive',    (SELECT COUNT(*)::int FROM carts WHERE status='active' AND last_seen_at >= _cutoff),
      'cartsAbandoned', (SELECT COUNT(*)::int FROM carts WHERE status='abandoned' OR (status='active' AND last_seen_at < _cutoff))
    ),
    'avgTicket', COALESCE((SELECT AVG(total_mxn)::int FROM orders WHERE status='approved'),0),
    'visits', jsonb_build_object(
      'pv_d1',   COALESCE((SELECT COUNT(*)::int FROM page_views WHERE created_at >= now() - interval '1 day'),0),
      'pv_d7',   COALESCE((SELECT COUNT(*)::int FROM page_views WHERE created_at >= now() - interval '7 days'),0),
      'pv_d30',  COALESCE((SELECT COUNT(*)::int FROM page_views WHERE created_at >= now() - interval '30 days'),0),
      'sess_d1', COALESCE((SELECT COUNT(DISTINCT session_id)::int FROM page_views WHERE created_at >= now() - interval '1 day'),0),
      'sess_d7', COALESCE((SELECT COUNT(DISTINCT session_id)::int FROM page_views WHERE created_at >= now() - interval '7 days'),0),
      'sess_d30',COALESCE((SELECT COUNT(DISTINCT session_id)::int FROM page_views WHERE created_at >= now() - interval '30 days'),0)
    ),
    'daily', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('day', d, 'count', c, 'revenue', r) ORDER BY d DESC) FROM (
        SELECT to_char(date_trunc('day', created_at),'YYYY-MM-DD') AS d,
               COUNT(*)::int AS c, SUM(total_mxn)::int AS r
        FROM orders WHERE status='approved' AND created_at >= now() - interval '30 days'
        GROUP BY 1
      ) x
    ), '[]'::jsonb),
    'recentOrders', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'created_at', created_at, 'customer_name', customer_name,
        'customer_email', customer_email, 'total_mxn', total_mxn,
        'status', status, 'shipping_status', shipping_status
      ) ORDER BY created_at DESC) FROM (
        SELECT id, created_at, customer_name, customer_email, total_mxn, status, shipping_status
        FROM orders ORDER BY created_at DESC LIMIT 10
      ) x
    ), '[]'::jsonb),
    'topProducts30d', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('slug', sl, 'views', v) ORDER BY v DESC) FROM (
        SELECT product_slug AS sl, COUNT(*)::int AS v FROM analytics_events
        WHERE created_at >= now() - interval '30 days' AND name='view_product' AND product_slug IS NOT NULL
        GROUP BY 1 ORDER BY 2 DESC LIMIT 8
      ) x
    ), '[]'::jsonb),
    'recentVisits', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('path', path, 'created_at', created_at, 'device', device, 'referrer_host', referrer_host) ORDER BY created_at DESC) FROM (
        SELECT path, created_at, device, referrer_host FROM page_views ORDER BY created_at DESC LIMIT 10
      ) x
    ), '[]'::jsonb),
    'recentEvents', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('name', name, 'product_slug', product_slug, 'value_mxn', value_mxn, 'created_at', created_at) ORDER BY created_at DESC) FROM (
        SELECT name, product_slug, value_mxn, created_at FROM analytics_events ORDER BY created_at DESC LIMIT 10
      ) x
    ), '[]'::jsonb),
    'health', jsonb_build_object(
      'lastPageviewAt', (SELECT MAX(created_at) FROM page_views),
      'lastEventAt',    (SELECT MAX(created_at) FROM analytics_events),
      'lastOrderAt',    (SELECT MAX(created_at) FROM orders),
      'lastCartAt',     (SELECT MAX(last_seen_at) FROM carts)
    )
  ) INTO result;
  RETURN result;
END $$;

GRANT EXECUTE ON FUNCTION public.admin_dashboard_summary() TO authenticated;
