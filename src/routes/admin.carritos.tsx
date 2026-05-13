import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListAbandonedCarts } from "@/lib/admin.functions";
import { formatMxn } from "@/lib/pricing";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/admin/carritos")({ component: Carritos });

function Carritos() {
  const fn = useServerFn(adminListAbandonedCarts);
  const { data } = useQuery({ queryKey: ["admin","carts"], queryFn: () => fn() });
  const carts = data?.carts ?? [];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Carritos abandonados</h1>
      <p className="text-sm text-muted-foreground">Carritos con email donde el cliente no completó la compra después de 1 hora.</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider">
            <tr><th className="px-3 py-2">Última actividad</th><th className="px-3 py-2">Cliente</th><th className="px-3 py-2">Subtotal</th><th className="px-3 py-2">Items</th><th></th></tr>
          </thead>
          <tbody>
            {carts.map((c) => (
              <tr key={c.id} className="border-t border-border align-top">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(c.last_seen_at).toLocaleString("es-MX")}</td>
                <td className="px-3 py-2"><div className="font-medium">{c.customer_name ?? "(sin nombre)"}</div><div className="text-xs text-muted-foreground">{c.email}</div><div className="text-xs">{c.phone}</div></td>
                <td className="px-3 py-2 tabular-nums">{formatMxn(c.subtotal_mxn ?? 0)}</td>
                <td className="px-3 py-2 text-xs">{Array.isArray(c.items) ? (c.items as Array<{productName?: string; qty?: number}>).map((i, idx) => <div key={idx}>{i.productName} ×{i.qty}</div>) : null}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">
                  {c.phone && <a href={buildWaLink(`Hola ${c.customer_name ?? ""}, vi que dejaste un carrito en Péptidos Mayoreo. ¿Te ayudo a completar tu pedido?`)} target="_blank" rel="noopener" className="text-primary hover:underline">WhatsApp</a>}
                  {c.phone && c.email && " · "}
                  {c.email && <a href={`mailto:${c.email}?subject=Tu carrito en Péptidos Mayoreo`} className="text-primary hover:underline">Email</a>}
                </td>
              </tr>
            ))}
            {carts.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">Sin carritos abandonados.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}