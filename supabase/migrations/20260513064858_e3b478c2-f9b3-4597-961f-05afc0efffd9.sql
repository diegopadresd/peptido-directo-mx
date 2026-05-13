CREATE OR REPLACE FUNCTION public.admin_analytics(_days INT DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE result JSONB; _since TIMESTAMPTZ;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  _since := now() - (GREATEST(1, LEAST(_days, 365)) || ' days')::interval;

  SELECT jsonb_build_object(
    'daily', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('day', d, 'views', v, 'sessions', s) ORDER BY d) FROM (
        SELECT to_char(date_trunc('day', created_at),'YYYY-MM-DD') AS d,
               COUNT(*)::int AS v, COUNT(DISTINCT session_id)::int AS s
        FROM page_views WHERE created_at >= _since GROUP BY 1
      ) x
    ), '[]'::jsonb),
    'topPages', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('path', p, 'views', v, 'sessions', s) ORDER BY v DESC) FROM (
        SELECT path AS p, COUNT(*)::int AS v, COUNT(DISTINCT session_id)::int AS s
        FROM page_views WHERE created_at >= _since GROUP BY path ORDER BY 2 DESC LIMIT 25
      ) x
    ), '[]'::jsonb),
    'topReferrers', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('host', h, 'visits', v) ORDER BY v DESC) FROM (
        SELECT COALESCE(referrer_host,'(directo)') AS h, COUNT(*)::int AS v
        FROM page_views WHERE created_at >= _since GROUP BY 1 ORDER BY 2 DESC LIMIT 15
      ) x
    ), '[]'::jsonb),
    'devices', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('device', dv, 'visits', v)) FROM (
        SELECT COALESCE(device,'desconocido') AS dv, COUNT(*)::int AS v
        FROM page_views WHERE created_at >= _since GROUP BY 1
      ) x
    ), '[]'::jsonb),
    'utm', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('source', src, 'medium', med, 'campaign', cmp, 'visits', v) ORDER BY v DESC) FROM (
        SELECT COALESCE(utm_source,'-') AS src, COALESCE(utm_medium,'-') AS med, COALESCE(utm_campaign,'-') AS cmp, COUNT(*)::int AS v
        FROM page_views WHERE created_at >= _since AND utm_source IS NOT NULL GROUP BY 1,2,3 ORDER BY 4 DESC LIMIT 20
      ) x
    ), '[]'::jsonb),
    'topProducts', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('slug', sl, 'views', v) ORDER BY v DESC) FROM (
        SELECT product_slug AS sl, COUNT(*)::int AS v FROM analytics_events
        WHERE created_at >= _since AND name='view_product' AND product_slug IS NOT NULL
        GROUP BY 1 ORDER BY 2 DESC LIMIT 20
      ) x
    ), '[]'::jsonb),
    'addToCart', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('slug', sl, 'count', c) ORDER BY c DESC) FROM (
        SELECT product_slug AS sl, COUNT(*)::int AS c FROM analytics_events
        WHERE created_at >= _since AND name='add_to_cart' AND product_slug IS NOT NULL
        GROUP BY 1 ORDER BY 2 DESC LIMIT 20
      ) x
    ), '[]'::jsonb),
    'searches', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('q', q, 'count', c) ORDER BY c DESC) FROM (
        SELECT lower(meta->>'q') AS q, COUNT(*)::int AS c FROM analytics_events
        WHERE created_at >= _since AND name='search' AND meta->>'q' IS NOT NULL
        GROUP BY 1 ORDER BY 2 DESC LIMIT 20
      ) x
    ), '[]'::jsonb),
    'funnel', jsonb_build_object(
      'sessions',       (SELECT COUNT(DISTINCT session_id)::int FROM page_views WHERE created_at >= _since),
      'view_product',   (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events WHERE created_at >= _since AND name='view_product'),
      'add_to_cart',    (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events WHERE created_at >= _since AND name='add_to_cart'),
      'begin_checkout', (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events WHERE created_at >= _since AND name='begin_checkout'),
      'orders_pending', (SELECT COUNT(*)::int FROM orders WHERE created_at >= _since),
      'orders_approved',(SELECT COUNT(*)::int FROM orders WHERE created_at >= _since AND status='approved')
    )
  ) INTO result;
  RETURN result;
END $$;
GRANT EXECUTE ON FUNCTION public.admin_analytics(INT) TO authenticated;