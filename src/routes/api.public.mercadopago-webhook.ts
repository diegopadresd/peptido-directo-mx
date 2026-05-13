import { createFileRoute } from "@tanstack/react-router";

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

          console.log("[MP webhook] payment", {
            id: payment.id,
            status: payment.status,
            status_detail: payment.status_detail,
            amount: payment.transaction_amount,
            ref: payment.external_reference,
            metadata: payment.metadata,
            payer_email: payment.payer?.email,
          });

          // TODO: persist to DB / send WhatsApp notification when an orders
          // table is added. For now we just log so the user can confirm in
          // server logs that the webhook fires correctly.

          return new Response("ok", { status: 200 });
        } catch (err) {
          console.error("MP webhook handler error", err);
          return new Response("error", { status: 200 });
        }
      },
    },
  },
});
