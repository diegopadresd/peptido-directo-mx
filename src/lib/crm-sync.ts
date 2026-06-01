// Server-only: ships local catalog + DB rows to the central CRM ingest endpoint.
// All errors are swallowed and only summary counts are logged.

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { products as catalog } from "@/data/products";

const CRM_URL =
  "https://project--e730ba8b-d7c5-4ed6-8694-e31a24c88138.lovable.app/api/public/sync";
const CRM_TOKEN = "c3144f6b20ae924f25ed40ab902524879dfbcf919e9f00bc";
const SITE_URL = "https://peptidosmayoreo.com";
const BATCH = 200;

type Json = Record<string, unknown>;

async function postBatch(payload: Json): Promise<Json | null> {
  try {
    const res = await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ingest-token": CRM_TOKEN,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.warn("[crm-sync] non-2xx", res.status);
      return null;
    }
    return (await res.json().catch(() => null)) as Json | null;
  } catch (err) {
    console.warn("[crm-sync] network error", err instanceof Error ? err.message : "unknown");
    return null;
  }
}

async function sendInBatches(key: "products" | "orders" | "customers", rows: Json[], replace: boolean) {
  if (rows.length === 0) {
    // Still send an empty replace so the CRM clears the side if requested.
    if (replace) await postBatch({ replace: true, [key]: [] });
    return { sent: 0, batches: 0 };
  }
  let sent = 0;
  let batches = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const slice = rows.slice(i, i + BATCH);
    // Only the first batch carries `replace: true` so we don't wipe between pages.
    const useReplace = replace && i === 0;
    await postBatch({ replace: useReplace, [key]: slice });
    sent += slice.length;
    batches += 1;
  }
  return { sent, batches };
}

// ---------- Builders ----------

function buildProductPayload(p: (typeof catalog)[number]): Json {
  const minVariant = p.variants.reduce(
    (m, v) => (v.basePricePerVial < m.basePricePerVial ? v : m),
    p.variants[0],
  );
  return {
    external_id: p.slug,
    name: p.name,
    url: `${SITE_URL}/productos/${p.slug}`,
    price_cents: Math.round(minVariant.basePricePerVial * 100),
    currency: "MXN",
    status: p.inStock ? "active" : "out_of_stock",
    metadata: {
      category: p.category,
      tags: p.tags,
      bestSeller: p.bestSeller ?? false,
      variants: p.variants.map((v) => ({
        dose: v.dose,
        mg: v.mg,
        base_price_mxn: v.basePricePerVial,
      })),
    },
  };
}

type OrderRow = {
  id: string;
  external_reference: string | null;
  status: string;
  shipping_status: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: Record<string, unknown> | null;
  total_mxn: number;
  created_at: string;
};

type OrderItemRow = {
  order_id: string;
  product_name: string;
  product_slug: string;
  dose: string;
  qty: number;
  unit_price_mxn: number;
  line_total_mxn: number;
};

function buildOrderPayload(o: OrderRow, items: OrderItemRow[]): Json {
  const orderItems = items
    .filter((it) => it.order_id === o.id)
    .map((it) => ({
      name: `${it.product_name} ${it.dose}`,
      qty: it.qty,
      price_cents: Math.round(it.unit_price_mxn * 100),
      sku: `${it.product_slug}:${it.dose}`,
    }));
  const itemCount = orderItems.reduce((a, x) => a + x.qty, 0);
  return {
    external_id: o.id,
    order_number: o.external_reference ?? o.id,
    status: o.status,
    fulfillment_status: o.shipping_status ?? undefined,
    customer_email: o.customer_email,
    customer_name: o.customer_name,
    subtotal_cents: Math.round(o.total_mxn * 100),
    total_cents: Math.round(o.total_mxn * 100),
    currency: "MXN",
    item_count: itemCount,
    items: orderItems,
    shipping_address: o.customer_address ?? undefined,
    placed_at: new Date(o.created_at).toISOString(),
  };
}

type CustomerAgg = {
  email: string;
  name?: string;
  phone?: string;
  total_orders: number;
  total_spent_cents: number;
  last_order_at?: string;
};

function buildCustomerPayload(c: CustomerAgg): Json {
  return {
    email: c.email,
    name: c.name,
    phone: c.phone,
    total_orders: c.total_orders,
    total_spent_cents: c.total_spent_cents,
    currency: "MXN",
    last_order_at: c.last_order_at,
    external_id: c.email,
  };
}

// ---------- Full backfills ----------

export async function syncProducts(replace = false) {
  const rows = catalog.map(buildProductPayload);
  const r = await sendInBatches("products", rows, replace);
  console.log(`[crm-sync] products: ${r.sent} sent in ${r.batches} batch(es)`);
  return { count: r.sent };
}

async function loadAllOrdersWithItems() {
  const orders: OrderRow[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, external_reference, status, shipping_status, customer_name, customer_email, customer_phone, customer_address, total_mxn, created_at",
      )
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);
    if (error || !data || data.length === 0) break;
    orders.push(...(data as unknown as OrderRow[]));
    if (data.length < pageSize) break;
  }
  if (orders.length === 0) return { orders, items: [] as OrderItemRow[] };
  const ids = orders.map((o) => o.id);
  const items: OrderItemRow[] = [];
  for (let i = 0; i < ids.length; i += 200) {
    const slice = ids.slice(i, i + 200);
    const { data } = await supabaseAdmin
      .from("order_items")
      .select("order_id, product_name, product_slug, dose, qty, unit_price_mxn, line_total_mxn")
      .in("order_id", slice);
    if (data) items.push(...(data as unknown as OrderItemRow[]));
  }
  return { orders, items };
}

export async function syncOrders(replace = false) {
  const { orders, items } = await loadAllOrdersWithItems();
  const rows = orders.map((o) => buildOrderPayload(o, items));
  const r = await sendInBatches("orders", rows, replace);
  console.log(`[crm-sync] orders: ${r.sent} sent in ${r.batches} batch(es)`);
  return { count: r.sent };
}

function aggregateCustomers(orders: OrderRow[]): CustomerAgg[] {
  const map = new Map<string, CustomerAgg>();
  for (const o of orders) {
    const email = (o.customer_email || "").toLowerCase();
    if (!email) continue;
    const spent = o.status === "approved" ? Math.round((o.total_mxn ?? 0) * 100) : 0;
    const cur = map.get(email);
    if (cur) {
      cur.total_orders += 1;
      cur.total_spent_cents += spent;
      if (!cur.last_order_at || o.created_at > cur.last_order_at) {
        cur.last_order_at = new Date(o.created_at).toISOString();
      }
      if (!cur.name && o.customer_name) cur.name = o.customer_name;
      if (!cur.phone && o.customer_phone) cur.phone = o.customer_phone;
    } else {
      map.set(email, {
        email,
        name: o.customer_name || undefined,
        phone: o.customer_phone || undefined,
        total_orders: 1,
        total_spent_cents: spent,
        last_order_at: new Date(o.created_at).toISOString(),
      });
    }
  }
  return Array.from(map.values());
}

export async function syncCustomers(replace = false) {
  const { orders } = await loadAllOrdersWithItems();
  const rows = aggregateCustomers(orders).map(buildCustomerPayload);
  const r = await sendInBatches("customers", rows, replace);
  console.log(`[crm-sync] customers: ${r.sent} sent in ${r.batches} batch(es)`);
  return { count: r.sent };
}

export async function syncAll(replace = false) {
  const [p, o, c] = await Promise.all([
    syncProducts(replace),
    syncOrders(replace),
    syncCustomers(replace),
  ]);
  return { products: p.count, orders: o.count, customers: c.count };
}

// ---------- Live (single-row) updates ----------

export async function syncOrderByIdLive(orderId: string) {
  try {
    const { data: o } = await supabaseAdmin
      .from("orders")
      .select(
        "id, external_reference, status, shipping_status, customer_name, customer_email, customer_phone, customer_address, total_mxn, created_at",
      )
      .eq("id", orderId)
      .maybeSingle();
    if (!o) return;
    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("order_id, product_name, product_slug, dose, qty, unit_price_mxn, line_total_mxn")
      .eq("order_id", orderId);
    const payload = buildOrderPayload(o as unknown as OrderRow, (items ?? []) as unknown as OrderItemRow[]);
    await postBatch({ replace: false, orders: [payload] });

    // Re-aggregate just this customer from all their orders.
    const email = (o as unknown as OrderRow).customer_email;
    if (email) await syncCustomerByEmailLive(email);
  } catch (err) {
    console.warn("[crm-sync] live order failed", err instanceof Error ? err.message : "unknown");
  }
}

export async function syncCustomerByEmailLive(email: string) {
  try {
    const normalized = email.toLowerCase();
    const { data } = await supabaseAdmin
      .from("orders")
      .select("id, status, customer_name, customer_phone, customer_email, total_mxn, created_at, external_reference, shipping_status, customer_address")
      .ilike("customer_email", normalized);
    const orders = (data ?? []) as unknown as OrderRow[];
    if (orders.length === 0) return;
    const agg = aggregateCustomers(orders).find((c) => c.email === normalized);
    if (!agg) return;
    await postBatch({ replace: false, customers: [buildCustomerPayload(agg)] });
  } catch (err) {
    console.warn("[crm-sync] live customer failed", err instanceof Error ? err.message : "unknown");
  }
}

export async function syncProductBySlugLive(slug: string) {
  try {
    const p = catalog.find((x) => x.slug === slug);
    if (!p) return;
    await postBatch({ replace: false, products: [buildProductPayload(p)] });
  } catch (err) {
    console.warn("[crm-sync] live product failed", err instanceof Error ? err.message : "unknown");
  }
}