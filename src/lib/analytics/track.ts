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
    await supabase.rpc("track_pageview" as never, {
      _session: sid,
      _path: path,
      _referrer: refClean,
      _device: deviceType(),
      _utm_source: url.searchParams.get("utm_source") ?? "",
      _utm_medium: url.searchParams.get("utm_medium") ?? "",
      _utm_campaign: url.searchParams.get("utm_campaign") ?? "",
      _user_agent: navigator.userAgent ?? "",
    } as never);
  } catch (e) { if (typeof console !== "undefined") console.warn("[analytics] pageview failed", e); }
}

export async function trackEvent(name: string, opts: { path?: string; productSlug?: string; valueMxn?: number; meta?: Record<string, unknown> } = {}) {
  if (typeof window === "undefined") return;
  const sid = sessionId();
  if (!sid) return;
  try {
    await supabase.rpc("track_event" as never, {
      _session: sid,
      _name: name,
      _path: opts.path ?? window.location.pathname,
      _product_slug: opts.productSlug ?? "",
      _value_mxn: opts.valueMxn ?? null,
      _meta: (opts.meta ?? null) as never,
    } as never);
  } catch (e) { if (typeof console !== "undefined") console.warn("[analytics] event failed", e); }
}

export async function syncCart(input: {
  cartToken: string;
  items: Array<Record<string, unknown>>;
  subtotalMxn: number;
  email?: string | null;
  customerName?: string | null;
  phone?: string | null;
}) {
  if (typeof window === "undefined") return;
  if (!input.cartToken) return;
  try {
    await supabase.rpc("cart_upsert" as never, {
      _cart_token: input.cartToken,
      _items: input.items as never,
      _subtotal_mxn: Math.max(0, Math.round(input.subtotalMxn || 0)),
      _email: input.email ?? null,
      _customer_name: input.customerName ?? null,
      _phone: input.phone ?? null,
    } as never);
  } catch (e) { if (typeof console !== "undefined") console.warn("[analytics] cart sync failed", e); }
}