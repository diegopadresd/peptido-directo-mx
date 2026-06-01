const CRM_URL = "https://project--e730ba8b-d7c5-4ed6-8694-e31a24c88138.lovable.app/api/public/ingest";
const CRM_TOKEN = "c3144f6b20ae924f25ed40ab902524879dfbcf919e9f00bc";

export type CrmCartPayload = {
  items: Array<Record<string, unknown>>;
  item_count: number;
  value_cents: number;
  currency: string;
  user_email?: string;
};

function getVisitorId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("crm_visitor_id");
  } catch {
    return null;
  }
}

function send(event: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const visitor_id = getVisitorId();
  const body = {
    events: [
      {
        visitor_id,
        page_path: window.location.pathname,
        ts: new Date().toISOString(),
        ...event,
      },
    ],
  };
  try {
    fetch(CRM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ingest-token": CRM_TOKEN,
      },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // swallow
  }
}

export function trackCart(cart: CrmCartPayload) {
  send({ type: "cart_update", cart, user_email: cart.user_email });
}

export type CheckoutStep =
  | "checkout_start"
  | "checkout_step"
  | "checkout_complete"
  | "checkout_abandoned";

export function trackCheckout(step: CheckoutStep, cart: CrmCartPayload) {
  send({ type: step, cart, user_email: cart.user_email });
}