import { createFileRoute } from "@tanstack/react-router";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { notifyAdminNewOrder } from "@/lib/email/notify.server";
import { getEcartpayOrder, mapEcartpayStatus } from "@/lib/ecartpay.server";

export const Route = createFileRoute("/api/public/ecartpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const refFromUrl = url.searchParams.get("ref"); // our order id (fallback)
        const rawBody = await request.text();

        // Optional signature verification — only enforced if the secret is set.
        const secret = process.env.ECARTPAY_WEBHOOK_SECRET;
        if (secret) {
          const sig = request.headers.get("x-pay-signature") || "";
          const ts = request.headers.get("x-pay-timestamp") || "";
          const wid = request.headers.get("x-pay-webhook-id") || "";
          try {
            const parsed = JSON.parse(rawBody) as { data?: unknown };
            const base = `${ts}.${wid}.${JSON.stringify(parsed.data ?? {})}`;
            const expected = "SHA256=" + crypto.createHmac("sha256", secret).update(base).digest("hex");
            const a = Buffer.from(sig);
            const b = Buffer.from(expected);
            if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
              return new Response("invalid signature", { status: 401 });
            }
          } catch {
            return new Response("bad body", { status: 400 });
          }
        }

        let payload: { data?: { id?: string; reference?: string; status?: string }; event?: string };
        try { payload = JSON.parse(rawBody); }
        catch { return new Response("bad json", { status: 400 }); }

        const ecartId = payload?.data?.id;
        const orderId = payload?.data?.reference || refFromUrl;
        if (!orderId) {
          console.warn("[ecartpay webhook] no order reference", payload);
          return new Response("no ref", { status: 200 });
        }

        let status = payload?.data?.status;
        let amount: number | undefined;

        // Authoritative fetch — re-read order from ecartpay if we have its id.
        if (ecartId) {
          try {
            const full = await getEcartpayOrder(ecartId);
            status = (full.status as string) || status;
            const t = (full as { total?: number; amount?: number }).total ?? (full as { amount?: number }).amount;
            if (typeof t === "number") amount = Math.round(t);
          } catch (e) {
            console.error("[ecartpay webhook] fetch order failed", e);
          }
        }

        const mapped = mapEcartpayStatus(status);

        const { data: existing } = await supabaseAdmin.from("orders")
          .select("id, status, notified_at, total_mxn, customer_name, customer_email, customer_phone, customer_address, notes, external_reference")
          .eq("id", orderId).maybeSingle();
        if (!existing) return new Response("order not found", { status: 200 });

        await supabaseAdmin.from("orders").update({
          status: mapped,
          ecartpay_payment_id: ecartId ?? null,
          ecartpay_status_detail: status ?? null,
          ...(amount ? { total_mxn: amount } : {}),
        }).eq("id", orderId);

        await supabaseAdmin.from("order_events").insert({
          order_id: orderId,
          event: `ecartpay_${mapped}`,
          payload: { ecartpay_id: ecartId ?? null, status, raw: payload?.event ?? null },
        });

        if (mapped === "approved" && !existing.notified_at) {
          const { data: items } = await supabaseAdmin.from("order_items")
            .select("product_name, dose, qty, line_total_mxn").eq("order_id", orderId);
          try {
            await notifyAdminNewOrder({
              id: existing.id,
              external_reference: existing.external_reference,
              total_mxn: amount ?? existing.total_mxn,
              customer_name: existing.customer_name,
              customer_email: existing.customer_email,
              customer_phone: existing.customer_phone,
              customer_address: existing.customer_address as Record<string, unknown>,
              notes: existing.notes,
              items: items ?? [],
            });
            await supabaseAdmin.from("orders").update({ notified_at: new Date().toISOString() }).eq("id", orderId);
          } catch (e) {
            console.error("notifyAdminNewOrder failed", e);
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});