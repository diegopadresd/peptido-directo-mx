import { supabase } from "@/integrations/supabase/client";

const SK = "pm_session_id";

function sessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let v = sessionStorage.getItem(SK);
    if (!v) {
      v = (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 40);
      sessionStorage.setItem(SK, v);
    }
    return v;
  } catch { return "anon"; }
}

function deviceType(): string {
  if (typeof window === "undefined") return "";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

let lastPath = "";
export async function trackPageview(path: string) {
  if (typeof window === "undefined") return;
  if (path === lastPath) return;
  lastPath = path;
  const sid = sessionId();
  if (!sid) return;
  const url = new URL(window.location.href);
  const ref = document.referrer || "";
  // Skip self-referrers
  const refClean = ref && !ref.startsWith(window.location.origin) ? ref : "";
  try {
    await supabase.rpc("track_pageview", {
      _session: sid,
      _path: path,
      _referrer: refClean,
      _device: deviceType(),
      _utm_source: url.searchParams.get("utm_source") ?? "",
      _utm_medium: url.searchParams.get("utm_medium") ?? "",
      _utm_campaign: url.searchParams.get("utm_campaign") ?? "",
      _user_agent: navigator.userAgent ?? "",
    });
  } catch { /* silent */ }
}

export async function trackEvent(name: string, opts: { path?: string; productSlug?: string; valueMxn?: number; meta?: Record<string, unknown> } = {}) {
  if (typeof window === "undefined") return;
  const sid = sessionId();
  if (!sid) return;
  try {
    await supabase.rpc("track_event", {
      _session: sid,
      _name: name,
      _path: opts.path ?? window.location.pathname,
      _product_slug: opts.productSlug ?? "",
      _value_mxn: opts.valueMxn ?? null,
      _meta: (opts.meta ?? null) as never,
    });
  } catch { /* silent */ }
}