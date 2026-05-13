import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Response("Forbidden", { status: 403 });
}

export const adminGetDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.rpc("admin_dashboard_summary");
    if (error) throw new Response(error.message, { status: 500 });
    return data as {
      revenue: { d1: number; d7: number; d30: number };
      counts: { ordersTotal: number; ordersApproved: number; ordersPending: number; cartsActive: number; cartsAbandoned: number };
      avgTicket: number;
      visits: { pv_d1: number; pv_d7: number; pv_d30: number; sess_d1: number; sess_d7: number; sess_d30: number };
      daily: { day: string; count: number; revenue: number }[];
    };
  });

const AnalyticsSchema = z.object({ days: z.number().int().min(1).max(365).default(30) }).default({ days: 30 });
export const adminGetAnalytics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => AnalyticsSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: out, error } = await supabaseAdmin.rpc("admin_analytics", { _days: data.days });
    if (error) throw new Response(error.message, { status: 500 });
    return out as {
      daily: { day: string; views: number; sessions: number }[];
      topPages: { path: string; views: number; sessions: number }[];
      topReferrers: { host: string; visits: number }[];
      devices: { device: string; visits: number }[];
      utm: { source: string; medium: string; campaign: string; visits: number }[];
      topProducts: { slug: string; views: number }[];
      addToCart: { slug: string; count: number }[];
      searches: { q: string; count: number }[];
      funnel: Record<string, number>;
    };
  });

const ListSchema = z.object({
  search: z.string().max(120).optional(),
  status: z.string().max(40).optional(),
  shipping: z.string().max(40).optional(),
  limit: z.number().int().min(1).max(200).default(50),
}).default({ limit: 50 });

export const adminListOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ListSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    let q = supabaseAdmin.from("orders").select("id, created_at, customer_name, customer_email, customer_phone, total_mxn, status, shipping_status, tracking_number")
      .order("created_at", { ascending: false }).limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    if (data.shipping) q = q.eq("shipping_status", data.shipping);
    if (data.search) q = q.or(`customer_email.ilike.%${data.search}%,customer_name.ilike.%${data.search}%,customer_phone.ilike.%${data.search}%`);
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
      supabaseAdmin.from("order_events").select("*").eq("order_id", data.id).order("created_at", { ascending: false }),
    ]);
    return { order, items: items ?? [], events: events ?? [] };
  });

const UpdateOrderSchema = z.object({
  id: z.string().uuid(),
  shipping_status: z.enum(["pendiente","empacado","enviado","entregado","cancelado"]).optional(),
  tracking_number: z.string().max(100).optional(),
  carrier: z.enum(["Estafeta","DHL","FedEx","Otro"]).optional(),
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
    await supabaseAdmin.from("order_events").insert({ order_id: data.id, event: "admin_update", payload: update as Record<string, string> });
    return { ok: true };
  });

export const adminListAbandonedCarts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data, error } = await supabaseAdmin.from("carts")
      .select("id, email, customer_name, phone, items, subtotal_mxn, last_seen_at, created_at")
      .or(`status.eq.abandoned,and(status.eq.active,last_seen_at.lt.${cutoff})`)
      .not("email", "is", null)
      .order("last_seen_at", { ascending: false }).limit(200);
    if (error) throw new Response(error.message, { status: 500 });
    return { carts: data ?? [] };
  });

export const adminListCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: orders } = await supabaseAdmin.from("orders")
      .select("customer_email, customer_name, customer_phone, total_mxn, status, created_at, customer_address")
      .order("created_at", { ascending: false }).limit(1000);
    const map = new Map<string, { email: string; name: string; phone: string; orders: number; spent: number; lastOrder: string; address: string }>();
    (orders ?? []).forEach((o) => {
      const k = (o.customer_email || "").toLowerCase();
      if (!k) return;
      const cur = map.get(k);
      const inc = o.status === "approved" ? (o.total_mxn ?? 0) : 0;
      if (cur) {
        cur.orders += 1; cur.spent += inc;
        if (o.created_at > cur.lastOrder) cur.lastOrder = o.created_at;
      } else {
        map.set(k, { email: k, name: o.customer_name, phone: o.customer_phone, orders: 1, spent: inc, lastOrder: o.created_at, address: JSON.stringify(o.customer_address) });
      }
    });
    return { customers: Array.from(map.values()).sort((a,b) => b.spent - a.spent) };
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