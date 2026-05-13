import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { notifyAdminNewOrder } from "@/lib/email/notify.server";

export const Route = createFileRoute("/api/public/mercadopago-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (!token) return new Response("not configured", { status: 500 });

        let payload: { type?: string; data?: { id?: string | number }; action?: string };
        try {
          payload = await request.json();
        } catch {
          return new Response("bad request", { status: 400 });
        }

        // We only care about payment notifications. Always 200 quickly so MP
        // does not retry; we re-fetch the payment from MP API to verify.
        const isPayment =
          payload.type === "payment" || payload.action?.startsWith("payment.");
        const paymentId = payload?.data?.id;

        if (!isPayment || !paymentId) {
          return new Response("ignored", { status: 200 });
        }

        try {
          const res = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (!res.ok) {
            console.error("MP payment lookup failed", res.status);
            // 200 to avoid retry storms; we already logged.
            return new Response("lookup failed", { status: 200 });
          }
          const payment = (await res.json()) as {
            id: number;
            status: string;
            status_detail: string;
            transaction_amount: number;
            external_reference?: string;
            payer?: { email?: string };
            metadata?: Record<string, unknown>;
          };

          console.log("[MP webhook] payment", { id: payment.id, status: payment.status, ref: payment.external_reference });

          const orderId = payment.external_reference;
          if (!orderId) return new Response("no ref", { status: 200 });

          const { data: existing } = await supabaseAdmin.from("orders")
            .select("id, status, notified_at, total_mxn, customer_name, customer_email, customer_phone, customer_address, notes, external_reference")
            .eq("id", orderId).maybeSingle();
          if (!existing) return new Response("order not found", { status: 200 });

          await supabaseAdmin.from("orders").update({
            status: payment.status,
            mp_payment_id: String(payment.id),
            mp_status_detail: payment.status_detail,
            total_mxn: Math.round(payment.transaction_amount),
          }).eq("id", orderId);

          await supabaseAdmin.from("order_events").insert({
            order_id: orderId,
            event: `mp_${payment.status}`,
            payload: { payment_id: payment.id, status_detail: payment.status_detail, amount: payment.transaction_amount },
          });

          if (payment.status === "approved" && !existing.notified_at) {
            const { data: items } = await supabaseAdmin.from("order_items")
              .select("product_name, dose, qty, line_total_mxn").eq("order_id", orderId);
            await notifyAdminNewOrder({
              id: existing.id,
              external_reference: existing.external_reference,
              total_mxn: Math.round(payment.transaction_amount),
              customer_name: existing.customer_name,
              customer_email: existing.customer_email,
              customer_phone: existing.customer_phone,
              customer_address: existing.customer_address as Record<string, unknown>,
              notes: existing.notes,
              items: items ?? [],
            });
            await supabaseAdmin.from("orders").update({ notified_at: new Date().toISOString() }).eq("id", orderId);
          }

          return new Response("ok", { status: 200 });
        } catch (err) {
          console.error("MP webhook handler error", err);
          return new Response("error", { status: 200 });
        }
      },
    },
  },
});
