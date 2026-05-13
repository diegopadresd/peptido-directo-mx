import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SITE_URL } from "@/lib/whatsapp";

const BodySchema = z.object({
  productSlug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  productName: z.string().min(1).max(150),
  dose: z.string().min(1).max(50),
  qty: z.number().int().min(1).max(1000),
  unitPrice: z.number().int().min(1).max(10_000_000),
  total: z.number().int().min(1).max(1_000_000_000),
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/checkout/mercadopago")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (!token) {
          return new Response(
            JSON.stringify({ error: "Mercado Pago no está configurado" }),
            { status: 500, headers: { "Content-Type": "application/json", ...CORS } },
          );
        }

        let body: z.infer<typeof BodySchema>;
        try {
          body = BodySchema.parse(await request.json());
        } catch (e) {
          return new Response(
            JSON.stringify({ error: "Datos inválidos" }),
            { status: 400, headers: { "Content-Type": "application/json", ...CORS } },
          );
        }

        // Recompute total server-side from unitPrice * qty as soft sanity check.
        // We accept the client total because pack discounts live in /lib/pricing
        // and the client sends the final amount; if mismatch is huge we reject.
        const expected = body.unitPrice * body.qty;
        if (body.total > expected * 1.05 || body.total < expected * 0.5) {
          return new Response(
            JSON.stringify({ error: "Monto inconsistente" }),
            { status: 400, headers: { "Content-Type": "application/json", ...CORS } },
          );
        }

        const orderRef = `${body.productSlug}-${body.dose}-${body.qty}-${Date.now()}`;

        const preference = {
          items: [
            {
              id: body.productSlug,
              title: `${body.productName} ${body.dose} — pack ${body.qty} viales`,
              description: `Mayoreo péptidos México · ${body.qty} viales de ${body.dose}`,
              category_id: "health",
              quantity: 1,
              currency_id: "MXN",
              unit_price: body.total,
            },
          ],
          external_reference: orderRef,
          statement_descriptor: "PEPTIDOSMAYOREO",
          back_urls: {
            success: `${SITE_URL}/pago/exito?ref=${encodeURIComponent(orderRef)}`,
            failure: `${SITE_URL}/pago/fallo?ref=${encodeURIComponent(orderRef)}`,
            pending: `${SITE_URL}/pago/pendiente?ref=${encodeURIComponent(orderRef)}`,
          },
          auto_return: "approved",
          notification_url: `${SITE_URL}/api/public/mercadopago-webhook`,
          metadata: {
            product_slug: body.productSlug,
            dose: body.dose,
            qty: body.qty,
          },
        };

        try {
          const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Idempotency-Key": orderRef,
            },
            body: JSON.stringify(preference),
          });

          if (!res.ok) {
            const errText = await res.text();
            console.error("MP preference error", res.status, errText);
            return new Response(
              JSON.stringify({ error: "No se pudo crear la preferencia de pago" }),
              { status: 502, headers: { "Content-Type": "application/json", ...CORS } },
            );
          }

          const data = (await res.json()) as { init_point?: string; id?: string };
          if (!data.init_point) {
            return new Response(
              JSON.stringify({ error: "Respuesta inválida de Mercado Pago" }),
              { status: 502, headers: { "Content-Type": "application/json", ...CORS } },
            );
          }

          return new Response(
            JSON.stringify({ init_point: data.init_point, preference_id: data.id, ref: orderRef }),
            { status: 200, headers: { "Content-Type": "application/json", ...CORS } },
          );
        } catch (err) {
          console.error("MP request failed", err);
          return new Response(
            JSON.stringify({ error: "Error de red al contactar Mercado Pago" }),
            { status: 502, headers: { "Content-Type": "application/json", ...CORS } },
          );
        }
      },
    },
  },
});
