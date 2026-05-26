/**
 * eCartPay server-side client.
 * Docs: https://docs.ecart.com
 *
 * Auth: POST /api/auth/login with { publicKey, secretKey } returns a JWT (1h TTL).
 * Orders: POST /api/orders with Bearer token to create a hosted payment session.
 *         GET  /api/orders/:id to read authoritative status.
 */

type EcartpayEnv = "live" | "sandbox";

const LIVE_BASE = "https://api.ecart.com";
const SANDBOX_BASE = "https://sandbox-api.ecart.com";

function baseUrl(): string {
  const env = (process.env.ECARTPAY_ENV ?? "live").toLowerCase() as EcartpayEnv;
  return env === "sandbox" ? SANDBOX_BASE : LIVE_BASE;
}

type CachedToken = { token: string; expiresAt: number };
let cached: CachedToken | null = null;

async function getToken(): Promise<string> {
  const now = Date.now();
  if (cached && cached.expiresAt > now + 30_000) return cached.token;

  const publicKey = process.env.ECARTPAY_PUBLIC_KEY;
  const secretKey = process.env.ECARTPAY_SECRET_KEY;
  if (!publicKey || !secretKey) throw new Error("eCartPay no está configurado (faltan llaves)");

  const res = await fetch(`${baseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicKey, secretKey }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`eCartPay auth ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { token?: string; access_token?: string };
  const token = data.token ?? data.access_token;
  if (!token) throw new Error("eCartPay auth: respuesta sin token");
  cached = { token, expiresAt: now + 55 * 60_000 }; // 55 min
  return token;
}

export type EcartpayItem = {
  name: string;
  quantity: number;
  price: number; // MXN
  sku?: string;
};

export type CreateEcartpayOrderInput = {
  reference: string;
  totalMxn: number;
  items: EcartpayItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    street: string;
    extNumber: string;
    intNumber?: string;
    neighborhood: string;
    postalCode: string;
    city: string;
    state: string;
  };
  redirectUrl: string;
  notifyUrl?: string;
};

export type CreateEcartpayOrderResult = {
  id: string;
  paymentUrl: string;
  raw: unknown;
};

export async function createEcartpayOrder(input: CreateEcartpayOrderInput): Promise<CreateEcartpayOrderResult> {
  const token = await getToken();
  const body = {
    reference: input.reference,
    currency: "MXN",
    total: input.totalMxn,
    items: input.items.map((it) => ({
      name: it.name.slice(0, 180),
      quantity: it.quantity,
      price: it.price,
      sku: it.sku,
    })),
    customer: {
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone,
    },
    shipping: {
      street: input.shipping.street,
      externalNumber: input.shipping.extNumber,
      internalNumber: input.shipping.intNumber ?? "",
      neighborhood: input.shipping.neighborhood,
      zipCode: input.shipping.postalCode,
      city: input.shipping.city,
      state: input.shipping.state,
      country: "MX",
    },
    redirectUrl: input.redirectUrl,
    notifyUrl: input.notifyUrl,
  };

  const res = await fetch(`${baseUrl()}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`eCartPay create order ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as Record<string, unknown>;
  const id =
    (data.id as string | undefined) ??
    (data._id as string | undefined) ??
    ((data.order as { id?: string } | undefined)?.id);
  const paymentUrl =
    (data.paymentUrl as string | undefined) ??
    (data.payment_url as string | undefined) ??
    (data.checkoutUrl as string | undefined) ??
    (data.url as string | undefined);
  if (!id || !paymentUrl) {
    throw new Error(`eCartPay: respuesta sin id/paymentUrl (${JSON.stringify(data).slice(0, 200)})`);
  }
  return { id, paymentUrl, raw: data };
}

export type EcartpayOrderStatus = "pending" | "approved" | "rejected" | "cancelled" | "refunded";

export function mapEcartpayStatus(status: string | undefined | null): EcartpayOrderStatus {
  const s = (status ?? "").toLowerCase();
  if (["paid", "approved", "completed", "complete", "success"].includes(s)) return "approved";
  if (["rejected", "failed", "declined"].includes(s)) return "rejected";
  if (["cancelled", "canceled"].includes(s)) return "cancelled";
  if (["refunded"].includes(s)) return "refunded";
  return "pending";
}

export async function getEcartpayOrder(id: string): Promise<Record<string, unknown>> {
  const token = await getToken();
  const res = await fetch(`${baseUrl()}/api/orders/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`eCartPay get order ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as Record<string, unknown>;
}