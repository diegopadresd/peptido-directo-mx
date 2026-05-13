/**
 * Server-side notification helper.
 * Sends an admin email via Lovable Emails API when configured.
 * Falls back to logging only — never throws (we don't want to break the webhook).
 */

type OrderForEmail = {
  id: string;
  external_reference: string | null;
  total_mxn: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: Record<string, unknown>;
  notes?: string | null;
  items: Array<{ product_name: string; dose: string; qty: number; line_total_mxn: number }>;
};

function formatAddress(a: Record<string, unknown>): string {
  const part = (k: string) => (typeof a[k] === "string" ? (a[k] as string) : "");
  return [
    `${part("street")} ${part("extNumber")}${part("intNumber") ? ` int. ${part("intNumber")}` : ""}`,
    `Col. ${part("neighborhood")}`,
    `CP ${part("postalCode")}, ${part("city")}, ${part("state")}`,
    part("references") ? `Ref: ${part("references")}` : "",
  ].filter(Boolean).join("\n");
}

function buildAdminHtml(order: OrderForEmail): string {
  const itemsHtml = order.items.map((it) =>
    `<tr><td style="padding:6px 8px">${it.product_name} ${it.dose}</td><td style="padding:6px 8px">${it.qty}</td><td style="padding:6px 8px;text-align:right">$${it.line_total_mxn.toLocaleString("es-MX")}</td></tr>`
  ).join("");
  const addr = formatAddress(order.customer_address).replace(/\n/g, "<br>");
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#fff;color:#111;padding:24px;max-width:640px;margin:auto">
    <h1 style="font-size:22px;margin:0 0 8px">Nuevo pedido confirmado</h1>
    <p style="color:#555;margin:0 0 16px">Ref: <code>${order.external_reference ?? order.id}</code></p>
    <h2 style="font-size:16px;margin:18px 0 6px">Cliente</h2>
    <p style="margin:0">${order.customer_name}<br>${order.customer_email}<br>${order.customer_phone}</p>
    <h2 style="font-size:16px;margin:18px 0 6px">Dirección de envío</h2>
    <p style="margin:0;line-height:1.5">${addr}</p>
    <h2 style="font-size:16px;margin:18px 0 6px">Productos</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #eee">
      <thead><tr style="background:#f6f6f6"><th style="text-align:left;padding:6px 8px">Producto</th><th style="text-align:left;padding:6px 8px">Qty</th><th style="text-align:right;padding:6px 8px">Total</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="text-align:right;font-size:18px;font-weight:bold;margin:16px 0">Total: $${order.total_mxn.toLocaleString("es-MX")} MXN</p>
    ${order.notes ? `<p style="background:#fffbe5;padding:10px;border-radius:6px"><strong>Notas:</strong> ${order.notes}</p>` : ""}
    <p style="margin-top:24px;font-size:12px;color:#888">Imprime la guía con esta dirección. Marca como enviado en el panel admin.</p>
  </body></html>`;
}

export async function notifyAdminNewOrder(order: OrderForEmail): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) {
    console.log("[notify] ADMIN_NOTIFICATION_EMAIL not set — skipping");
    return;
  }
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    console.log("[notify] LOVABLE_API_KEY not set — skipping");
    return;
  }
  try {
    // Lovable Emails transactional send endpoint (active once email domain verified + infra deployed)
    const html = buildAdminHtml(order);
    const body = {
      to: adminEmail,
      subject: `Nuevo pedido $${order.total_mxn.toLocaleString("es-MX")} MXN — ${order.customer_name}`,
      html,
    };
    const res = await fetch("https://api.lovable.dev/email/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn("[notify] email send failed", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.warn("[notify] email send threw", err);
  }
}