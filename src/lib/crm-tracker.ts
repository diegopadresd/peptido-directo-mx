/** Lightweight CRM tracker — sends events to the central CRM. */
const CRM_ENDPOINT =
  "https://project--e730ba8b-d7c5-4ed6-8694-e31a24c88138.lovable.app/api/public/ingest";
const CRM_TOKEN = "c3144f6b20ae924f25ed40ab902524879dfbcf919e9f00bc";
const STORE_NAME = "Péptidos Directo México";
const VID_KEY = "crm_vid";
const FLUSH_MS = 5000;
const HEARTBEAT_MS = 30000;
const MAX_BATCH = 20;

type CrmEvent = { type: string; ts: string; visitor_id: string; store: string; page_path: string; page_title: string; referrer: string; user_email?: string | null; payload?: Record<string, unknown>; };

let queue: CrmEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let initialized = false;
let lastPath = "";

function uuid(): string {
  try { if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID(); } catch { /* ignore */ }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; const v = c === "x" ? r : (r & 0x3) | 0x8; return v.toString(16); });
}
function getVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  try { let id = localStorage.getItem(VID_KEY); if (!id) { id = uuid(); localStorage.setItem(VID_KEY, id); } return id; } catch { return "anon"; }
}
function buildEvent(type: string, payload?: Record<string, unknown>, user_email?: string | null): CrmEvent {
  return { type, ts: new Date().toISOString(), visitor_id: getVisitorId(), store: STORE_NAME, page_path: typeof window !== "undefined" ? window.location.pathname + window.location.search : "", page_title: typeof document !== "undefined" ? document.title : "", referrer: typeof document !== "undefined" ? document.referrer || "" : "", user_email: user_email ?? undefined, payload };
}
function sendBatch(events: CrmEvent[], useBeacon: boolean) {
  if (events.length === 0) return;
  const body = JSON.stringify({ store: STORE_NAME, events });
  try {
    if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({ store: STORE_NAME, token: CRM_TOKEN, events })], { type: "application/json" });
      if (navigator.sendBeacon(CRM_ENDPOINT, blob)) return;
    }
    fetch(CRM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "x-ingest-token": CRM_TOKEN }, body, keepalive: true, mode: "cors" }).catch(() => {});
  } catch { /* swallow */ }
}
function flush(useBeacon = false) { if (queue.length === 0) return; const batch = queue; queue = []; sendBatch(batch, useBeacon); }
function enqueue(ev: CrmEvent) { queue.push(ev); if (queue.length >= MAX_BATCH) flush(false); }

export function trackEvent(type: string, payload?: Record<string, unknown>, user_email?: string | null) { try { enqueue(buildEvent(type, payload, user_email)); } catch { /* swallow */ } }
export function trackPageview() { try { const path = window.location.pathname + window.location.search; if (path === lastPath) return; lastPath = path; enqueue(buildEvent("pageview")); } catch { /* swallow */ } }

export type CrmCartItemInput = { sku?: string | null; id?: string | null; name?: string | null; title?: string | null; quantity?: number; qty?: number; price?: number; price_cents?: number; };
export type CrmCartPayload = { items: Array<{ sku: string; name: string; qty: number; price_cents: number }>; item_count: number; value_cents: number; currency: string; checkout_step?: string; };
function normalizeCart(items: CrmCartItemInput[], opts: { currency?: string; checkout_step?: string; value_cents?: number } = {}): CrmCartPayload {
  const normItems = (items || []).map((i) => { const qty = Number(i.qty ?? i.quantity ?? 0) || 0; const price_cents = i.price_cents != null ? Math.round(Number(i.price_cents)) : Math.round(Number(i.price ?? 0) * 100); return { sku: String(i.sku ?? i.id ?? ""), name: String(i.name ?? i.title ?? ""), qty, price_cents }; });
  const item_count = normItems.reduce((s, i) => s + i.qty, 0);
  const value_cents = opts.value_cents != null ? Math.round(opts.value_cents) : normItems.reduce((s, i) => s + i.price_cents * i.qty, 0);
  const cart: CrmCartPayload = { items: normItems, item_count, value_cents, currency: opts.currency ?? "MXN" };
  if (opts.checkout_step) cart.checkout_step = opts.checkout_step;
  return cart;
}
export function trackCartUpdate(args: { items: CrmCartItemInput[]; value_cents?: number; currency?: string; user_email?: string | null; }) {
  const cart = normalizeCart(args.items, { currency: args.currency ?? "MXN", value_cents: args.value_cents });
  const payload: Record<string, unknown> = { cart };
  if (args.user_email) payload.user_email = args.user_email;
  trackEvent("cart_update", payload, args.user_email ?? null);
}
export type CheckoutStep = "checkout_start" | "checkout_step" | "checkout_complete" | "checkout_abandoned";
export function trackCheckout(step: CheckoutStep, args: { items?: CrmCartItemInput[]; value_cents?: number; currency?: string; checkout_step?: string; user_email?: string | null; order_id?: string; [key: string]: unknown; } = {}) {
  const { items, value_cents, currency, checkout_step, user_email, ...rest } = args;
  const cart = normalizeCart(items ?? [], { currency: currency ?? "MXN", value_cents, checkout_step });
  const payload: Record<string, unknown> = { ...rest, cart };
  if (user_email) payload.user_email = user_email;
  trackEvent(step, payload, user_email ?? null);
}
export function initCrmTracker() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  enqueue(buildEvent("session_start"));
  lastPath = window.location.pathname + window.location.search;
  enqueue(buildEvent("pageview"));
  flushTimer = setInterval(() => flush(false), FLUSH_MS);
  heartbeatTimer = setInterval(() => { enqueue(buildEvent("session_heartbeat")); }, HEARTBEAT_MS);
  window.addEventListener("pagehide", () => flush(true));
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(true); });
}
