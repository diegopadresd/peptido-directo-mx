import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Response("Forbidden", { status: 403 });
}

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function failAdminQuery(label: string, error: { message?: string } | null | undefined): never {
  const message = error?.message
    ? `${label}: ${error.message}`
    : `${label}: respuesta inválida de la base de datos`;
  console.error(`[admin] ${message}`);
  throw new Response(message, { status: 500 });
}

function exactCount(label: string, count: number | null, error?: { message?: string } | null) {
  if (error || typeof count !== "number") failAdminQuery(label, error);
  return count;
}

function rowsOrFail<T>(label: string, data: T[] | null, error?: { message?: string } | null) {
  if (error || !Array.isArray(data)) failAdminQuery(label, error);
  return data;
}

function maybeRowOrFail<T>(label: string, data: T | null, error?: { message?: string } | null) {
  if (error) failAdminQuery(label, error);
  return data;
}

async function countSince(
  table: "page_views" | "analytics_events" | "orders" | "carts",
  column: string,
  days: number,
) {
  const q = supabaseAdmin
    .from(table)
    .select("*", { count: "exact", head: true })
    .gte(column, isoDaysAgo(days));
  const { count, error } = await q;
  return exactCount(`${table} count ${days}d`, count, error);
}

async function distinctSessionsSince(days: number, table: "page_views" | "analytics_events") {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("session_id")
    .gte("created_at", isoDaysAgo(days))
    .limit(50000);
  const rows = rowsOrFail(`${table} sessions ${days}d`, data, error);
  const set = new Set<string>();
  rows.forEach((r) => {
    if (r.session_id) set.add(r.session_id);
  });
  return set.size;
}

export const adminGetDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);

    const [
      pv_d1,
      pv_d7,
      pv_d30,
      sess_d1,
      sess_d7,
      sess_d30,
      ordersTotalRes,
      ordersApprovedRes,
      ordersPendingRes,
      cartsTotalRes,
      cartsActiveRes,
      pvTotalRes,
      evTotalRes,
      ordersTotalCountRes,
      cartsTotalCountRes,
      revenueRowsRes,
      recentOrdersRes,
      topProductsRes,
      recentVisitsRes,
      recentEventsRes,
      lastPvRes,
      lastEvRes,
      lastOrderRes,
      lastCartRes,
      avgTicketRowsRes,
    ] = await Promise.all([
      countSince("page_views", "created_at", 1),
      countSince("page_views", "created_at", 7),
      countSince("page_views", "created_at", 30),
      distinctSessionsSince(1, "page_views"),
      distinctSessionsSince(7, "page_views"),
      distinctSessionsSince(30, "page_views"),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved"),
      supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabaseAdmin.from("carts").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("carts")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .gte("last_seen_at", isoDaysAgo(1 / 24)),
      supabaseAdmin.from("page_views").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("analytics_events").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("carts").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("orders")
        .select("created_at, total_mxn, status")
        .eq("status", "approved")
        .gte("created_at", isoDaysAgo(30)),
      supabaseAdmin
        .from("orders")
        .select("id, created_at, customer_name, customer_email, total_mxn, status, shipping_status")
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("analytics_events")
        .select("product_slug")
        .eq("name", "view_product")
        .gte("created_at", isoDaysAgo(30))
        .not("product_slug", "is", null)
        .limit(10000),
      supabaseAdmin
        .from("page_views")
        .select("path, created_at, device, referrer_host")
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("analytics_events")
        .select("name, product_slug, value_mxn, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("page_views")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from("analytics_events")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from("orders")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from("carts")
        .select("last_seen_at")
        .order("last_seen_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin.from("orders").select("total_mxn").eq("status", "approved"),
    ]);

    const ordersTotal = exactCount("orders total", ordersTotalRes.count, ordersTotalRes.error);
    const ordersApproved = exactCount(
      "orders approved",
      ordersApprovedRes.count,
      ordersApprovedRes.error,
    );
    const ordersPending = exactCount(
      "orders pending",
      ordersPendingRes.count,
      ordersPendingRes.error,
    );
    exactCount("carts total", cartsTotalRes.count, cartsTotalRes.error);
    const cartsActive = exactCount("carts active", cartsActiveRes.count, cartsActiveRes.error);
    const pageViewsTotal = exactCount("page_views total", pvTotalRes.count, pvTotalRes.error);
    const analyticsEventsTotal = exactCount(
      "analytics_events total",
      evTotalRes.count,
      evTotalRes.error,
    );
    const ordersTotalRaw = exactCount(
      "orders raw total",
      ordersTotalCountRes.count,
      ordersTotalCountRes.error,
    );
    const cartsTotalRaw = exactCount(
      "carts raw total",
      cartsTotalCountRes.count,
      cartsTotalCountRes.error,
    );
    const revRows = rowsOrFail(
      "approved orders revenue rows",
      revenueRowsRes.data,
      revenueRowsRes.error,
    );
    const recentOrders = rowsOrFail("recent orders", recentOrdersRes.data, recentOrdersRes.error);
    const topProductRows = rowsOrFail(
      "top product events",
      topProductsRes.data,
      topProductsRes.error,
    );
    const recentVisits = rowsOrFail(
      "recent page views",
      recentVisitsRes.data,
      recentVisitsRes.error,
    );
    const recentEvents = rowsOrFail(
      "recent analytics events",
      recentEventsRes.data,
      recentEventsRes.error,
    );
    const lastPv = maybeRowOrFail("latest page view", lastPvRes.data, lastPvRes.error);
    const lastEv = maybeRowOrFail("latest analytics event", lastEvRes.data, lastEvRes.error);
    const lastOrder = maybeRowOrFail("latest order", lastOrderRes.data, lastOrderRes.error);
    const lastCart = maybeRowOrFail("latest cart", lastCartRes.data, lastCartRes.error);
    const avgRows = rowsOrFail(
      "approved orders ticket rows",
      avgTicketRowsRes.data,
      avgTicketRowsRes.error,
    );

    // Revenue buckets
    const now = Date.now();
    let r1 = 0,
      r7 = 0,
      r30 = 0;
    for (const o of revRows) {
      const ts = new Date(o.created_at).getTime();
      const ageDays = (now - ts) / (24 * 60 * 60 * 1000);
      const v = o.total_mxn ?? 0;
      if (ageDays <= 1) r1 += v;
      if (ageDays <= 7) r7 += v;
      if (ageDays <= 30) r30 += v;
    }

    // Daily orders
    const dailyMap = new Map<string, { count: number; revenue: number }>();
    for (const o of revRows) {
      const day = o.created_at.slice(0, 10);
      const cur = dailyMap.get(day) ?? { count: 0, revenue: 0 };
      cur.count += 1;
      cur.revenue += o.total_mxn ?? 0;
      dailyMap.set(day, cur);
    }
    const daily = Array.from(dailyMap.entries())
      .map(([day, v]) => ({ day, ...v }))
      .sort((a, b) => b.day.localeCompare(a.day));

    // Top products
    const topMap = new Map<string, number>();
    topProductRows.forEach((r) => {
      if (!r.product_slug) return;
      topMap.set(r.product_slug, (topMap.get(r.product_slug) ?? 0) + 1);
    });
    const topProducts30d = Array.from(topMap.entries())
      .map(([slug, views]) => ({ slug, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    // Avg ticket
    const avgTicket =
      avgRows.length > 0
        ? Math.round(avgRows.reduce((s, x) => s + (x.total_mxn ?? 0), 0) / avgRows.length)
        : 0;

    // Carts breakdown (active = seen in last hour, abandoned = total non-converted - active)
    const { count: cartsNonConvertedCount, error: cartsNonConvertedError } = await supabaseAdmin
      .from("carts")
      .select("*", { count: "exact", head: true })
      .neq("status", "converted");
    const cartsNonConverted = exactCount(
      "carts non-converted",
      cartsNonConvertedCount,
      cartsNonConvertedError,
    );
    const cartsAbandoned = Math.max(0, cartsNonConverted - cartsActive);

    return {
      revenue: { d1: r1, d7: r7, d30: r30 },
      counts: {
        ordersTotal,
        ordersApproved,
        ordersPending,
        cartsActive,
        cartsAbandoned,
      },
      avgTicket,
      visits: { pv_d1, pv_d7, pv_d30, sess_d1, sess_d7, sess_d30 },
      daily,
      recentOrders,
      topProducts30d,
      recentVisits,
      recentEvents,
      health: {
        lastPageviewAt: lastPv?.created_at ?? null,
        lastEventAt: lastEv?.created_at ?? null,
        lastOrderAt: lastOrder?.created_at ?? null,
        lastCartAt: lastCart?.last_seen_at ?? null,
      },
      raw: {
        pageViewsTotal,
        analyticsEventsTotal,
        ordersTotalRaw,
        cartsTotalRaw,
        generatedAt: new Date().toISOString(),
      },
    };
  });

const AnalyticsSchema = z
  .object({ days: z.number().int().min(1).max(365).default(30) })
  .default({ days: 30 });
export const adminGetAnalytics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => AnalyticsSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const since = isoDaysAgo(data.days);

    const [
      pvRes,
      evRes,
      ordersTotalRes,
      ordersApprovedRes,
      pvTotalRes,
      evTotalRes,
      pvRangeCountRes,
      evRangeCountRes,
    ] = await Promise.all([
      supabaseAdmin
        .from("page_views")
        .select(
          "path, session_id, created_at, device, referrer_host, utm_source, utm_medium, utm_campaign",
        )
        .gte("created_at", since)
        .limit(50000),
      supabaseAdmin
        .from("analytics_events")
        .select("name, product_slug, session_id, meta, created_at")
        .gte("created_at", since)
        .limit(50000),
      supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", since),
      supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")
        .gte("created_at", since),
      supabaseAdmin.from("page_views").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("analytics_events").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", since),
      supabaseAdmin
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .gte("created_at", since),
    ]);

    const pvs = rowsOrFail("analytics page views range", pvRes.data, pvRes.error);
    const evs = rowsOrFail("analytics events range", evRes.data, evRes.error);
    const ordersPending = exactCount(
      "analytics orders range",
      ordersTotalRes.count,
      ordersTotalRes.error,
    );
    const ordersApproved = exactCount(
      "analytics approved orders range",
      ordersApprovedRes.count,
      ordersApprovedRes.error,
    );
    const raw = {
      pageViewsTotal: exactCount("analytics page_views total", pvTotalRes.count, pvTotalRes.error),
      analyticsEventsTotal: exactCount(
        "analytics_events total",
        evTotalRes.count,
        evTotalRes.error,
      ),
      pageViewsInRange: exactCount(
        "analytics page_views in range",
        pvRangeCountRes.count,
        pvRangeCountRes.error,
      ),
      analyticsEventsInRange: exactCount(
        "analytics_events in range",
        evRangeCountRes.count,
        evRangeCountRes.error,
      ),
      generatedAt: new Date().toISOString(),
      days: data.days,
    };

    // Daily
    const dailyMap = new Map<string, { views: number; sessions: Set<string> }>();
    for (const v of pvs) {
      const day = v.created_at.slice(0, 10);
      const cur = dailyMap.get(day) ?? { views: 0, sessions: new Set() };
      cur.views += 1;
      if (v.session_id) cur.sessions.add(v.session_id);
      dailyMap.set(day, cur);
    }
    const daily = Array.from(dailyMap.entries())
      .map(([day, x]) => ({ day, views: x.views, sessions: x.sessions.size }))
      .sort((a, b) => a.day.localeCompare(b.day));

    // Top pages
    const pageMap = new Map<string, { views: number; sessions: Set<string> }>();
    for (const v of pvs) {
      const cur = pageMap.get(v.path) ?? { views: 0, sessions: new Set() };
      cur.views += 1;
      if (v.session_id) cur.sessions.add(v.session_id);
      pageMap.set(v.path, cur);
    }
    const topPages = Array.from(pageMap.entries())
      .map(([path, x]) => ({ path, views: x.views, sessions: x.sessions.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 25);

    // Referrers
    const refMap = new Map<string, number>();
    for (const v of pvs)
      refMap.set(
        v.referrer_host || "(directo)",
        (refMap.get(v.referrer_host || "(directo)") ?? 0) + 1,
      );
    const topReferrers = Array.from(refMap.entries())
      .map(([host, visits]) => ({ host, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 15);

    // Devices
    const devMap = new Map<string, number>();
    for (const v of pvs)
      devMap.set(v.device || "desconocido", (devMap.get(v.device || "desconocido") ?? 0) + 1);
    const devices = Array.from(devMap.entries()).map(([device, visits]) => ({ device, visits }));

    // UTM
    const utmMap = new Map<string, number>();
    for (const v of pvs) {
      if (!v.utm_source) continue;
      const k = `${v.utm_source}||${v.utm_medium ?? "-"}||${v.utm_campaign ?? "-"}`;
      utmMap.set(k, (utmMap.get(k) ?? 0) + 1);
    }
    const utm = Array.from(utmMap.entries())
      .map(([k, visits]) => {
        const [source, medium, campaign] = k.split("||");
        return { source, medium, campaign, visits };
      })
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 20);

    // Top products viewed
    const tpMap = new Map<string, number>();
    for (const e of evs)
      if (e.name === "view_product" && e.product_slug)
        tpMap.set(e.product_slug, (tpMap.get(e.product_slug) ?? 0) + 1);
    const topProducts = Array.from(tpMap.entries())
      .map(([slug, views]) => ({ slug, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20);

    // Add to cart
    const atcMap = new Map<string, number>();
    for (const e of evs)
      if (e.name === "add_to_cart" && e.product_slug)
        atcMap.set(e.product_slug, (atcMap.get(e.product_slug) ?? 0) + 1);
    const addToCart = Array.from(atcMap.entries())
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Searches
    const sMap = new Map<string, number>();
    for (const e of evs) {
      if (e.name !== "search") continue;
      const q = (e.meta as Record<string, unknown> | null)?.q;
      if (typeof q === "string" && q)
        sMap.set(q.toLowerCase(), (sMap.get(q.toLowerCase()) ?? 0) + 1);
    }
    const searches = Array.from(sMap.entries())
      .map(([q, count]) => ({ q, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Funnel
    function distinct(name: string) {
      const s = new Set<string>();
      for (const e of evs) if (e.name === name && e.session_id) s.add(e.session_id);
      return s.size;
    }
    const sessions = new Set<string>();
    for (const v of pvs) if (v.session_id) sessions.add(v.session_id);
    const funnel = {
      sessions: sessions.size,
      view_product: distinct("view_product"),
      add_to_cart: distinct("add_to_cart"),
      begin_checkout: distinct("begin_checkout"),
      orders_pending: ordersPending,
      orders_approved: ordersApproved,
    };

    return {
      daily,
      topPages,
      topReferrers,
      devices,
      utm,
      topProducts,
      addToCart,
      searches,
      funnel,
      raw,
    };
  });

const ListSchema = z
  .object({
    search: z.string().max(120).optional(),
    status: z.string().max(40).optional(),
    shipping: z.string().max(40).optional(),
    limit: z.number().int().min(1).max(200).default(50),
  })
  .default({ limit: 50 });

export const adminListOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ListSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    let q = supabaseAdmin
      .from("orders")
      .select(
        "id, created_at, customer_name, customer_email, customer_phone, total_mxn, status, shipping_status, tracking_number",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    if (data.shipping) q = q.eq("shipping_status", data.shipping);
    if (data.search)
      q = q.or(
        `customer_email.ilike.%${data.search}%,customer_name.ilike.%${data.search}%,customer_phone.ilike.%${data.search}%`,
      );
    const { data: rows, error } = await q;
    if (error) throw new Response(error.message, { status: 500 });
    return { orders: rows ?? [] };
  });

export const adminGetOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const [{ data: order }, { data: items }, { data: events }] = await Promise.all([
      supabaseAdmin.from("orders").select("*").eq("id", data.id).single(),
      supabaseAdmin.from("order_items").select("*").eq("order_id", data.id),
      supabaseAdmin
        .from("order_events")
        .select("*")
        .eq("order_id", data.id)
        .order("created_at", { ascending: false }),
    ]);
    return { order, items: items ?? [], events: events ?? [] };
  });

const UpdateOrderSchema = z.object({
  id: z.string().uuid(),
  shipping_status: z
    .enum(["pendiente", "empacado", "enviado", "entregado", "cancelado"])
    .optional(),
  tracking_number: z.string().max(100).optional(),
  carrier: z.enum(["Estafeta", "DHL", "FedEx", "Otro"]).optional(),
  admin_notes: z.string().max(2000).optional(),
});
export const adminUpdateOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => UpdateOrderSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const update: {
      shipping_status?: string;
      shipped_at?: string;
      tracking_number?: string;
      carrier?: string;
      admin_notes?: string;
    } = {};
    if (data.shipping_status) update.shipping_status = data.shipping_status;
    if (data.shipping_status === "enviado") update.shipped_at = new Date().toISOString();
    if (data.tracking_number !== undefined) update.tracking_number = data.tracking_number;
    if (data.carrier !== undefined) update.carrier = data.carrier;
    if (data.admin_notes !== undefined) update.admin_notes = data.admin_notes;
    const { error } = await supabaseAdmin.from("orders").update(update).eq("id", data.id);
    if (error) throw new Response(error.message, { status: 500 });
    await supabaseAdmin.from("order_events").insert({
      order_id: data.id,
      event: "admin_update",
      payload: update as Record<string, string>,
    });
    return { ok: true };
  });

export const adminListAbandonedCarts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("carts")
      .select(
        "id, status, email, customer_name, phone, items, subtotal_mxn, last_seen_at, created_at",
      )
      .neq("status", "converted")
      .gt("subtotal_mxn", 0)
      .order("last_seen_at", { ascending: false })
      .limit(200);
    if (error) throw new Response(error.message, { status: 500 });
    return { carts: data ?? [] };
  });

export const adminListCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select(
        "customer_email, customer_name, customer_phone, total_mxn, status, created_at, customer_address",
      )
      .order("created_at", { ascending: false })
      .limit(1000);
    const map = new Map<
      string,
      {
        email: string;
        name: string;
        phone: string;
        orders: number;
        spent: number;
        lastOrder: string;
        address: string;
      }
    >();
    (orders ?? []).forEach((o) => {
      const k = (o.customer_email || "").toLowerCase();
      if (!k) return;
      const cur = map.get(k);
      const inc = o.status === "approved" ? (o.total_mxn ?? 0) : 0;
      if (cur) {
        cur.orders += 1;
        cur.spent += inc;
        if (o.created_at > cur.lastOrder) cur.lastOrder = o.created_at;
      } else {
        map.set(k, {
          email: k,
          name: o.customer_name,
          phone: o.customer_phone,
          orders: 1,
          spent: inc,
          lastOrder: o.created_at,
          address: JSON.stringify(o.customer_address),
        });
      }
    });
    return { customers: Array.from(map.values()).sort((a, b) => b.spent - a.spent) };
  });

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data } = await supabaseAdmin.from("app_settings").select("*").eq("id", 1).single();
    return { settings: data, adminEmailEnv: process.env.ADMIN_NOTIFICATION_EMAIL ?? null };
  });

const SettingsSchema = z.object({
  admin_notification_email: z.string().email().nullable().optional(),
  send_customer_email: z.boolean().optional(),
});
export const adminUpdateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SettingsSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("app_settings").update(data).eq("id", 1);
    if (error) throw new Response(error.message, { status: 500 });
    return { ok: true };
  });
