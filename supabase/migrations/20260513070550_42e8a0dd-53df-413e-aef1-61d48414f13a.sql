
CREATE TABLE IF NOT EXISTS public.page_views (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer_host TEXT,
  device TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_pv_created ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pv_session ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_pv_path ON public.page_views(path);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  name TEXT NOT NULL,
  path TEXT,
  product_slug TEXT,
  value_mxn INTEGER,
  meta JSONB
);
CREATE INDEX IF NOT EXISTS idx_ae_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ae_name ON public.analytics_events(name);
CREATE INDEX IF NOT EXISTS idx_ae_session ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_ae_product ON public.analytics_events(product_slug);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin read pv" ON public.page_views;
CREATE POLICY "admin read pv" ON public.page_views FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "admin read ae" ON public.analytics_events;
CREATE POLICY "admin read ae" ON public.analytics_events FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.track_pageview(
  _session TEXT, _path TEXT, _referrer TEXT, _device TEXT,
  _utm_source TEXT, _utm_medium TEXT, _utm_campaign TEXT, _user_agent TEXT
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _host TEXT;
BEGIN
  IF _session IS NULL OR length(_session) = 0 OR length(_session) > 64 THEN RETURN; END IF;
  IF _path IS NULL OR length(_path) > 500 THEN RETURN; END IF;
  BEGIN _host := substring(_referrer from '^[a-z]+://([^/]+)'); EXCEPTION WHEN others THEN _host := NULL; END;
  INSERT INTO public.page_views(session_id, path, referrer_host, device, utm_source, utm_medium, utm_campaign, user_agent)
  VALUES (_session, _path, NULLIF(_host,''), NULLIF(_device,''), NULLIF(_utm_source,''), NULLIF(_utm_medium,''), NULLIF(_utm_campaign,''), NULLIF(left(_user_agent,500),''));
END $$;
GRANT EXECUTE ON FUNCTION public.track_pageview(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.track_event(
  _session TEXT, _name TEXT, _path TEXT, _product_slug TEXT, _value_mxn INTEGER, _meta JSONB
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF _session IS NULL OR length(_session) = 0 OR length(_session) > 64 THEN RETURN; END IF;
  IF _name IS NULL OR length(_name) > 64 THEN RETURN; END IF;
  INSERT INTO public.analytics_events(session_id, name, path, product_slug, value_mxn, meta)
  VALUES (_session, _name, NULLIF(_path,''), NULLIF(_product_slug,''), _value_mxn, _meta);
END $$;
GRANT EXECUTE ON FUNCTION public.track_event(TEXT,TEXT,TEXT,TEXT,INTEGER,JSONB) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_dashboard_summary()
RETURNS JSONB
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
    ), '[]'::jsonb)
  ) INTO result;
  RETURN result;
END $$;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_summary() TO authenticated;
