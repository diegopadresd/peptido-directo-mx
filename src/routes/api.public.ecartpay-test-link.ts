import { createFileRoute } from "@tanstack/react-router";
import { createEcartpayOrder } from "@/lib/ecartpay.server";

// Temporary helper endpoint to generate a $50 MXN test pay link.
// GET /api/public/ecartpay-test-link
export const Route = createFileRoute("/api/public/ecartpay-test-link")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const origin = `${url.protocol}//${url.host}`;
          const reference = `test-${Date.now()}`;
          const order = await createEcartpayOrder({
            items: [{ name: "Prueba de pago", quantity: 1, price: 50, is_service: true }],
            email: "test@peptidosmayoreo.com",
            firstName: "Prueba",
            lastName: "Ecartpay",
            phone: "5555555555",
            shippingAddress: {
              address1: "Calle de Prueba 123",
              city: "Ciudad de México",
              stateCode: "CMX",
              postalCode: "01000",
            },
            notifyUrl: `${origin}/api/public/ecartpay-webhook`,
            redirectUrl: `${origin}/pago/exito?ref=${reference}`,
            reference,
          });
          return Response.json({ ok: true, reference, pay_link: order.pay_link, id: order.id, raw: order });
        } catch (e) {
          return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
        }
      },
    },
  },
});