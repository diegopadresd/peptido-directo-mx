// Ecart Pay backend helper. Handles the short-lived auth token and
// exposes a typed POST for the Orders endpoint we use to create a
// hosted checkout link.
//
// Docs:
//   https://docs.ecartpay.com/docs/authorization-token
//   https://docs.ecartpay.com/docs/orders

const PROD_BASE = "https://ecartpay.com";
const SANDBOX_BASE = "https://sandbox.ecartpay.com";

function getBase() {
  // If the public key looks like a sandbox/test key we hit sandbox.
  // Otherwise prod. Most ecartpay keys are not prefixed, so we also
  // honour an explicit ECARTPAY_ENV=sandbox env override.
  const env = (process.env.ECARTPAY_ENV || "").toLowerCase();
  if (env === "sandbox" || env === "test") return SANDBOX_BASE;
  const pk = process.env.ECARTPAY_PUBLIC_KEY || "";
  if (/test|sandbox|sand/i.test(pk)) return SANDBOX_BASE;
  return PROD_BASE;
}

// In-memory token cache (worker instance scoped). Tokens last 1h.
let cachedToken: { token: string; expires: number } | null = null;

export async function getEcartpayToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expires - 60_000 > now) return cachedToken.token;

  const pub = process.env.ECARTPAY_PUBLIC_KEY;
  const priv = process.env.ECARTPAY_SECRET_KEY;
  if (!pub || !priv) throw new Error("ECARTPAY_PUBLIC_KEY / ECARTPAY_SECRET_KEY not set");

  const basic = Buffer.from(`${pub}:${priv}`).toString("base64");
  const res = await fetch(`${getBase()}/api/authorizations/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`ecartpay token failed ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = (await res.json()) as { token?: string; access_token?: string };
  const token = data.token || data.access_token;
  if (!token) throw new Error("ecartpay token response missing token");
  cachedToken = { token, expires: now + 55 * 60_000 };
  return token;
}

export interface EcartpayOrderItem {
  name: string;
  quantity: number;
  price: number; // in MXN (decimals allowed)
  is_service?: boolean;
}

export interface CreateEcartpayOrderInput {
  items: EcartpayOrderItem[];
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    stateCode: string;
    postalCode: string;
  };
  notifyUrl: string;
  redirectUrl: string;
  reference: string;
  metafields?: Record<string, string>;
}

export interface EcartpayOrderResponse {
  id?: string;
  pay_link?: string;
  status?: string;
  [k: string]: unknown;
}

export async function createEcartpayOrder(input: CreateEcartpayOrderInput): Promise<EcartpayOrderResponse> {
  const token = await getEcartpayToken();
  const body = {
    currency: "MXN",
    email: input.email,
    first_name: input.firstName,
    last_name: input.lastName,
    phone: input.phone,
    items: input.items,
    shipping_address: {
      country: { code: "MX", name: "Mexico" },
      state: { code: input.shippingAddress.stateCode },
      address1: input.shippingAddress.address1,
      address2: input.shippingAddress.address2 || "",
      city: input.shippingAddress.city,
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone,
      postal_code: input.shippingAddress.postalCode,
    },
    notify_url: input.notifyUrl,
    redirect_url: input.redirectUrl,
    reference: input.reference,
    metafields: input.metafields,
  };
  const res = await fetch(`${getBase()}/api/orders`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`ecartpay order failed ${res.status}: ${t.slice(0, 300)}`);
  }
  return (await res.json()) as EcartpayOrderResponse;
}

export async function getEcartpayOrder(id: string): Promise<EcartpayOrderResponse> {
  const token = await getEcartpayToken();
  const res = await fetch(`${getBase()}/api/orders/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: { Authorization: token, Accept: "application/json" },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`ecartpay get order failed ${res.status}: ${t.slice(0, 300)}`);
  }
  return (await res.json()) as EcartpayOrderResponse;
}

/**
 * Map ecartpay order status strings to our internal `orders.status`
 * vocabulary, which mirrors the prior Mercado Pago model: pending,
 * approved, rejected, cancelled, in_process.
 */
export function mapEcartpayStatus(s?: string): string {
  const v = (s || "").toLowerCase();
  if (["paid", "approved", "completed", "success"].includes(v)) return "approved";
  if (["cancelled", "canceled", "expired", "failed", "rejected"].includes(v)) return "rejected";
  if (["pending", "processing", "in_process", "in_review"].includes(v)) return "pending";
  return v || "pending";
}