import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SITE_URL } from "@/lib/whatsapp";
import { getStripe } from "@/lib/stripe.server";

const ItemSchema = z.object({
  productSlug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  productName: z.string().min(1).max(180),
  dose: z.string().min(1).max(50),
  qty: z.number().int().min(1).max(1000),
  unitPrice: z.number().int().min(1).max(10_000_000),
  lineTotal: z.number().int().min(1).max(1_000_000_000),
});

const BodySchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email().max(180),
  customerPhone: z.string().min(10).max(20),
  street: z.string().min(2).max(180),
  extNumber: z.string().min(1).max(30),
  intNumber: z.string().max(30).optional().default(""),
  neighborhood: z.string().min(2).max(120),
  postalCode: z.string().regex(/^\d{5}$/),
  city: z.string().min(2).max(120),
  state: z.string().min(2).max(60),
  references: z.string().max(300).optional().default(""),
  rfc: z.string().max(13).optional().default(""),
  notes: z.string().max(500).optional().default(""),
  items: z.array(ItemSchema).min(1).max(50),
  cartToken: z.string().max(80).optional(),
});

export const Route = createFileRoute("/api/checkout/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!process.env.STRIPE_SECRET_KEY) {
          return json({ error: "Stripe no está configurado" }, 500);
        }

        let body: z.infer<typeof BodySchema>;
        try { body = BodySchema.parse(await request.json()); }
        catch (e) { return json({ error: "Datos inválidos", details: e instanceof Error ? e.message : "" }, 400); }

        const subtotal = body.items.reduce((a, x) => a + x.lineTotal, 0);
        for (const it of body.items) {
          if (Math.abs(it.lineTotal - it.unitPrice * it.qty) > it.unitPrice * it.qty * 0.5) {
            return json({ error: "Monto inconsistente en un item" }, 400);
          }
        }

        // 1. Create order in DB.
        const { data: order, error: oErr } = await supabaseAdmin.from("orders").insert({
          status: "pending",
          total_mxn: subtotal,
          customer_name: body.customerName,
          customer_email: body.customerEmail,
          customer_phone: body.customerPhone,
          customer_address: {
            street: body.street, extNumber: body.extNumber, intNumber: body.intNumber,
            neighborhood: body.neighborhood, postalCode: body.postalCode, city: body.city,
            state: body.state, references: body.references, rfc: body.rfc,
          },
          notes: body.notes || null,
          shipping_status: "pendiente",
        }).select("id").single();
        if (oErr || !order) {
          console.error("create order failed", oErr);
          return json({ error: "No se pudo crear el pedido" }, 500);
        }

        // 2. Insert line items.
        const { error: iErr } = await supabaseAdmin.from("order_items").insert(
          body.items.map((it) => ({
            order_id: order.id,
            product_slug: it.productSlug,
            product_name: it.productName,
            dose: it.dose,
            qty: it.qty,
            unit_price_mxn: it.unitPrice,
            line_total_mxn: it.lineTotal,
          })),
        );
        if (iErr) console.error("insert items failed", iErr);

        // 3. Mark cart converted (best-effort).
        if (body.cartToken) {
          await supabaseAdmin.from("carts")
            .update({ status: "converted", converted_order_id: order.id })
            .eq("cart_token", body.cartToken);
        }

        const externalRef = order.id;
        await supabaseAdmin.from("orders").update({ external_reference: externalRef }).eq("id", order.id);

        try {
          const stripe = getStripe();
          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: body.customerEmail,
            client_reference_id: externalRef,
            line_items: body.items.map((it) => ({
              quantity: 1,
              price_data: {
                currency: "mxn",
                unit_amount: it.lineTotal * 100, // MXN → centavos
                product_data: {
                  name: `${it.productName} ${it.dose} · pack ${it.qty} viales`.slice(0, 180),
                  metadata: { product_slug: it.productSlug, dose: it.dose, qty: String(it.qty) },
                },
              },
            })),
            metadata: { order_id: externalRef },
            success_url: `${SITE_URL}/pago/exito?session_id={CHECKOUT_SESSION_ID}&ref=${encodeURIComponent(externalRef)}`,
            cancel_url: `${SITE_URL}/pago/fallo?ref=${encodeURIComponent(externalRef)}`,
          });

          if (!session.url) {
            console.error("stripe session missing url", session.id);
            return json({ error: "Stripe no devolvió un enlace de pago" }, 502);
          }

          await supabaseAdmin.from("orders").update({
            mp_preference_id: session.id, // reuse legacy column for stripe session id
          }).eq("id", order.id);
          await supabaseAdmin.from("order_events").insert({
            order_id: order.id,
            event: "order_created",
            payload: { stripe_session_id: session.id },
          });

          return json({ init_point: session.url, order_id: order.id }, 200);
        } catch (err) {
          console.error("stripe create session error", err);
          return json({ error: err instanceof Error ? err.message : "Error con Stripe" }, 502);
        }
      },
    },
  },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}