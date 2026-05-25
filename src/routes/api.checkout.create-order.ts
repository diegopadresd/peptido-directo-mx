import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SITE_URL } from "@/lib/whatsapp";
import { createEcartpayOrder } from "@/lib/ecartpay.server";

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

// Lightweight MX state → ISO/INEGI code map. ecartpay accepts the standard
// 2-3 letter code for shipping_address.state.code. Anything not found falls
// back to the first 3 chars of the name.
const MX_STATE_CODES: Record<string, string> = {
  "Aguascalientes": "AGU", "Baja California": "BCN", "Baja California Sur": "BCS",
  "Campeche": "CAM", "Chiapas": "CHP", "Chihuahua": "CHH", "Ciudad de México": "CMX",
  "Coahuila": "COA", "Colima": "COL", "Durango": "DUR", "Estado de México": "MEX",
  "Guanajuato": "GUA", "Guerrero": "GRO", "Hidalgo": "HID", "Jalisco": "JAL",
  "Michoacán": "MIC", "Morelos": "MOR", "Nayarit": "NAY", "Nuevo León": "NLE",
  "Oaxaca": "OAX", "Puebla": "PUE", "Querétaro": "QUE", "Quintana Roo": "ROO",
  "San Luis Potosí": "SLP", "Sinaloa": "SIN", "Sonora": "SON", "Tabasco": "TAB",
  "Tamaulipas": "TAM", "Tlaxcala": "TLA", "Veracruz": "VER", "Yucatán": "YUC",
  "Zacatecas": "ZAC",
};

export const Route = createFileRoute("/api/checkout/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!process.env.ECARTPAY_PUBLIC_KEY || !process.env.ECARTPAY_SECRET_KEY) {
          return json({ error: "ecartpay no está configurado" }, 500);
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

        // 4. Split full name → first/last for ecartpay.
        const nameParts = body.customerName.trim().split(/\s+/);
        const firstName = nameParts.slice(0, Math.max(1, Math.ceil(nameParts.length / 2))).join(" ");
        const lastName = nameParts.slice(Math.max(1, Math.ceil(nameParts.length / 2))).join(" ") || firstName;

        const stateCode = MX_STATE_CODES[body.state] || body.state.slice(0, 3).toUpperCase();
        const street = `${body.street} ${body.extNumber}${body.intNumber ? ` Int ${body.intNumber}` : ""}`;

        try {
          const ec = await createEcartpayOrder({
            items: body.items.map((it) => ({
              name: `${it.productName} ${it.dose} · pack ${it.qty} viales`.slice(0, 180),
              quantity: 1,
              price: it.lineTotal,
              is_service: false,
            })),
            email: body.customerEmail,
            firstName,
            lastName,
            phone: body.customerPhone,
            shippingAddress: {
              address1: street,
              address2: body.neighborhood,
              city: body.city,
              stateCode,
              postalCode: body.postalCode,
            },
            notifyUrl: `${SITE_URL}/api/public/ecartpay-webhook?ref=${encodeURIComponent(externalRef)}`,
            redirectUrl: `${SITE_URL}/pago/exito?ref=${encodeURIComponent(externalRef)}`,
            reference: externalRef,
            metafields: { order_id: externalRef },
          });

          const payLink = ec.pay_link as string | undefined;
          if (!payLink) {
            console.error("ecartpay response missing pay_link", ec);
            return json({ error: "ecartpay no devolvió un enlace de pago" }, 502);
          }

          await supabaseAdmin.from("orders").update({
            ecartpay_session_id: (ec.id as string | undefined) ?? null,
          }).eq("id", order.id);
          await supabaseAdmin.from("order_events").insert({
            order_id: order.id,
            event: "order_created",
            payload: { ecartpay_id: ec.id ?? null },
          });

          return json({ init_point: payLink, order_id: order.id }, 200);
        } catch (err) {
          console.error("ecartpay create order error", err);
          return json({ error: err instanceof Error ? err.message : "Error con ecartpay" }, 502);
        }
      },
    },
  },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}