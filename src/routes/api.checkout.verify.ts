import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getStripe, mapStripeStatus } from "@/lib/stripe.server";
import { notifyAdminNewOrder } from "@/lib/email/notify.server";

// GET /api/checkout/verify?session_id=cs_xxx
// Called from the success page to authoritatively confirm payment with Stripe,
// update the order, and trigger the admin notification email (once).
export const Route = createFileRoute("/api/checkout/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const sessionId = url.searchParams.get("session_id");
        if (!sessionId) return json({ ok: false, error: "missing session_id" }, 400);

        let session;
        try {
          session = await getStripe().checkout.sessions.retrieve(sessionId);
        } catch (e) {
          console.error("stripe retrieve session failed", e);
          return json({ ok: false, error: "Stripe error" }, 502);
        }

        const orderId =
          (session.metadata?.order_id as string | undefined) ||
          session.client_reference_id ||
          undefined;
        if (!orderId) return json({ ok: false, error: "no order ref" }, 400);

        const mapped = mapStripeStatus(session.payment_status);
        const amount =
          typeof session.amount_total === "number"
            ? Math.round(session.amount_total / 100)
            : undefined;

        const { data: existing } = await supabaseAdmin
          .from("orders")
          .select(
            "id, status, notified_at, total_mxn, customer_name, customer_email, customer_phone, customer_address, notes, external_reference",
          )
          .eq("id", orderId)
          .maybeSingle();
        if (!existing) return json({ ok: false, error: "order not found" }, 404);

        await supabaseAdmin
          .from("orders")
          .update({
            status: mapped,
            mp_payment_id: (session.payment_intent as string | null) ?? null,
            mp_status_detail: session.payment_status ?? null,
            ...(amount ? { total_mxn: amount } : {}),
          })
          .eq("id", orderId);

        await supabaseAdmin.from("order_events").insert({
          order_id: orderId,
          event: `stripe_${mapped}`,
          payload: {
            stripe_session_id: session.id,
            payment_status: session.payment_status,
            via: "verify",
          },
        });

        if (mapped === "approved" && !existing.notified_at) {
          const { data: items } = await supabaseAdmin
            .from("order_items")
            .select("product_name, dose, qty, line_total_mxn")
            .eq("order_id", orderId);
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
            await supabaseAdmin
              .from("orders")
              .update({ notified_at: new Date().toISOString() })
              .eq("id", orderId);
          } catch (e) {
            console.error("notifyAdminNewOrder failed", e);
          }
        }

        return json({ ok: true, status: mapped, order_id: orderId });
      },
    },
  },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}