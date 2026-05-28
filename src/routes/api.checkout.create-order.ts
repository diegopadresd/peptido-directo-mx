import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SITE_URL } from "@/lib/whatsapp";

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

// Handoff a Zelara → check-out.mx (mismo flujo que Peptide MX).
// Zelara crea la orden con source="peptide-mx" y devuelve un init_point
// que apunta a https://check-out.mx/c/<token>.
const ZELARA_HANDOFF_URL =
  "https://uizhzrudwujhjwhwjzfm.supabase.co/functions/v1/create-checkout-handoff";
const ZELARA_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpemh6cnVkd3VqaGp3aHdqemZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3Nzk1OTMsImV4cCI6MjA4NDM1NTU5M30.kt5UZ6GbpBzRpdobwsPnEZVEasc-IG6FfFZn45unKfk";

export const Route = createFileRoute("/api/checkout/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: z.infer<typeof BodySchema>;
        try { body = BodySchema.parse(await request.json()); }
        catch (e) { return json({ error: "Datos inválidos", details: e instanceof Error ? e.message : "" }, 400); }

        const subtotal = body.items.reduce((a, x) => a + x.lineTotal, 0);
        for (const it of body.items) {
          if (Math.abs(it.lineTotal - it.unitPrice * it.qty) > it.unitPrice * it.qty * 0.5) {
            return json({ error: "Monto inconsistente en un item" }, 400);
          }
        }

        // Construye el payload para el handoff de Zelara → check-out.mx.
        // Usamos un id con prefijo "pmm:" para que el catálogo autoritativo de
        // Zelara NO sobrescriba los precios de pack que mandamos.
        const payload = {
          source: "peptide-mx",
          email: body.customerEmail,
          user_id: null,
          items: body.items.map((it) => ({
            id: `pmm:${it.productSlug}:${it.dose}:${it.qty}v`,
            title: `${it.productName} ${it.dose} · pack ${it.qty} viales`,
            quantity: 1,
            unit_price: it.lineTotal,
            picture_url: null,
            slug: it.productSlug,
          })),
          subtotal,
          shipping_cost: 0,
          total: subtotal,
          shipping_address: {
            full_name: body.customerName,
            phone: body.customerPhone,
            email: body.customerEmail,
            street: body.street,
            exterior_number: body.extNumber || null,
            interior_number: body.intNumber || null,
            neighborhood: body.neighborhood || null,
            city: body.city,
            state: body.state,
            postal_code: body.postalCode,
            country: "MX",
            notes: [body.references, body.notes, body.rfc ? `RFC: ${body.rfc}` : ""].filter(Boolean).join(" · ") || null,
          },
          return_url: `${SITE_URL}/pago/exito?order_id=`,
        };

        try {
          const res = await fetch(ZELARA_HANDOFF_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: ZELARA_ANON_KEY,
              Authorization: `Bearer ${ZELARA_ANON_KEY}`,
            },
            body: JSON.stringify(payload),
          });
          const data = await res.json().catch(() => null) as
            | { init_point?: string; order_id?: string; error?: string; detail?: string }
            | null;
          if (!res.ok || !data?.init_point) {
            console.error("create-checkout-handoff failed", res.status, data);
            return json({ error: data?.error || "No se pudo iniciar el pago" }, 502);
          }
          return json({ init_point: data.init_point, order_id: data.order_id }, 200);
        } catch (err) {
          console.error("create-checkout-handoff network error", err);
          return json({ error: "No se pudo conectar con el procesador de pagos" }, 502);
        }
      },
    },
  },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}