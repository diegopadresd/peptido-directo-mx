import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListOrders } from "@/lib/admin.functions";
import { Input } from "@/components/ui/input";
import { formatMxn } from "@/lib/pricing";

export const Route = createFileRoute("/admin/pedidos")({ component: Pedidos });

function Pedidos() {
  const fn = useServerFn(adminListOrders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { data } = useQuery({
    queryKey: ["admin","orders", search, status],
    queryFn: () => fn({ data: { search: search || undefined, status: status || undefined, limit: 100 } }),
  });
  const rows = data?.orders ?? [];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Pedidos</h1>
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Buscar por nombre, email, tel…" value={search} onChange={(e)=>setSearch(e.target.value)} className="max-w-xs" />
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="approved">Aprobado</option>
          <option value="in_process">En proceso</option>
          <option value="rejected">Rechazado</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider">
            <tr><th className="px-3 py-2">Fecha</th><th className="px-3 py-2">Cliente</th><th className="px-3 py-2">Total</th><th className="px-3 py-2">Pago</th><th className="px-3 py-2">Envío</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(o.created_at).toLocaleString("es-MX")}</td>
                <td className="px-3 py-2"><div className="font-medium">{o.customer_name}</div><div className="text-xs text-muted-foreground">{o.customer_email}</div></td>
                <td className="px-3 py-2 tabular-nums">{formatMxn(o.total_mxn)}</td>
                <td className="px-3 py-2"><Badge status={o.status} /></td>
                <td className="px-3 py-2"><Badge status={o.shipping_status} /></td>
                <td className="px-3 py-2"><Link to="/admin/pedidos/$id" params={{ id: o.id }} className="text-primary hover:underline">Ver</Link></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Sin pedidos.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-green-100 text-green-800", pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800", in_process: "bg-blue-100 text-blue-800",
    pendiente: "bg-yellow-100 text-yellow-800", empacado: "bg-blue-100 text-blue-800",
    enviado: "bg-purple-100 text-purple-800", entregado: "bg-green-100 text-green-800",
    cancelado: "bg-gray-200 text-gray-700",
  };
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-muted"}`}>{status}</span>;
}