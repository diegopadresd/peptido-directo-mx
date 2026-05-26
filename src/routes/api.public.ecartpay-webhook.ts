import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getEcartpayOrder, mapEcartpayStatus } from "@/lib/ecartpay.server";
import { notifyAdminNewOrder } from "@/lib/email/notify.server";

function ok(body: unknown = { ok: true }, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.ECARTPAY_WEBHOOK_SECRET;
  if (!secret) return true; // no secret configured → trust + re-fetch authoritatively
  if (!signature) return false;
  try {
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(signature.trim());
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/public/ecartpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const signature =
          request.headers.get("x-ecart-signature") ??
          request.headers.get("x-signature") ??
          request.headers.get("ecart-signature");

        if (!verifySignature(rawBody, signature)) {
          console.warn("[ecartpay-webhook] invalid signature");
          return ok({ error: "invalid signature" }, 401);
        }

        let payload: Record<string, unknown> = {};
        try {
          payload = JSON.parse(rawBody) as Record<string, unknown>;
        } catch {
          return ok({ error: "invalid json" }, 400);
        }

        const ecartpayId =
          (payload.id as string | undefined) ??
          (payload.orderId as string | undefined) ??
          ((payload.data as { id?: string } | undefined)?.id) ??
          ((payload.order as { id?: string } | undefined)?.id);
        const reference =
          (payload.reference as string | undefined) ??
          ((payload.data as { reference?: string } | undefined)?.reference) ??
          ((payload.order as { reference?: string } | undefined)?.reference);

        if (!ecartpayId && !reference) {
          console.warn("[ecartpay-webhook] missing id/reference", payload);
          return ok({ error: "missing id" }, 400);
        }

        // Authoritative re-fetch from eCart.
        let authoritative: Record<string, unknown> = payload;
        if (ecartpayId) {
          try {
            authoritative = await getEcartpayOrder(ecartpayId);
          } catch (err) {
            console.warn("[ecartpay-webhook] re-fetch failed, using payload", err);
          }
        }

        const rawStatus =
          (authoritative.status as string | undefined) ??
          ((authoritative.payment as { status?: string } | undefined)?.status) ??
          (payload.status as string | undefined);
        const mapped = mapEcartpayStatus(rawStatus);
        const authRef =
          (authoritative.reference as string | undefined) ??
          ((authoritative.order as { reference?: string } | undefined)?.reference) ??
          reference;

        // Locate our order. Prefer ecartpay_session_id, fall back to external_reference.
        let orderQuery = supabaseAdmin.from("orders").select("id, status, notified_at, customer_name, customer_email, customer_phone, customer_address, total_mxn, external_reference, notes").limit(1);
        if (ecartpayId) {
          orderQuery = orderQuery.eq("ecartpay_session_id", ecartpayId);
        } else if (authRef) {
          orderQuery = orderQuery.eq("external_reference", authRef);
        }
        const { data: orderRow, error: findErr } = await orderQuery.maybeSingle();
        if (findErr || !orderRow) {
          console.warn("[ecartpay-webhook] order not found", { ecartpayId, authRef, findErr });
          return ok({ error: "order not found" }, 200); // 200 so eCart doesn't retry forever
        }

        await supabaseAdmin.from("orders").update({
          status: mapped,
          ecartpay_status_detail: rawStatus ?? null,
          ecartpay_payment_id: ecartpayId ?? null,
          updated_at: new Date().toISOString(),
        }).eq("id", orderRow.id);
        await supabaseAdmin.from("order_events").insert({
          order_id: orderRow.id,
          event: `ecartpay_${mapped}`,
          payload: { rawStatus: rawStatus ?? null, ecartpayId: ecartpayId ?? null, body: JSON.parse(JSON.stringify(payload)) },
        });

        // Notify admin once when approved.
        if (mapped === "approved" && !orderRow.notified_at) {
          try {
            const { data: items } = await supabaseAdmin
              .from("order_items")
              .select("product_name, dose, qty, line_total_mxn")
              .eq("order_id", orderRow.id);
            await notifyAdminNewOrder({
              id: orderRow.id,
              external_reference: orderRow.external_reference ?? null,
              total_mxn: orderRow.total_mxn,
              customer_name: orderRow.customer_name,
              customer_email: orderRow.customer_email,
              customer_phone: orderRow.customer_phone,
              customer_address: (orderRow.customer_address ?? {}) as Record<string, unknown>,
              notes: orderRow.notes,
              items: items ?? [],
            });
            await supabaseAdmin
              .from("orders")
              .update({ notified_at: new Date().toISOString() })
              .eq("id", orderRow.id);
          } catch (err) {
            console.warn("[ecartpay-webhook] notify failed", err);
          }
        }

        return ok();
      },

      GET: async () => ok({ ok: true, hint: "POST only" }),
    },
  },
});