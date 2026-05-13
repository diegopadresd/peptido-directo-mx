import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListCustomers } from "@/lib/admin.functions";
import { callAdminFn, formatAdminError } from "@/lib/admin-client";
import { formatMxn } from "@/lib/pricing";

export const Route = createFileRoute("/admin/clientes")({ component: Clientes });

function Clientes() {
  const fn = useServerFn(adminListCustomers);
  const { data, isError, error } = useQuery({ queryKey: ["admin","customers"], queryFn: () => callAdminFn(fn), retry: false });
  const list = data?.customers ?? [];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Clientes</h1>
      {isError && <AdminError message={formatAdminError(error)} />}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider">
            <tr><th className="px-3 py-2">Cliente</th><th className="px-3 py-2">Pedidos</th><th className="px-3 py-2">Gastado</th><th className="px-3 py-2">Último pedido</th></tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.email} className="border-t border-border">
                <td className="px-3 py-2"><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.email} · {c.phone}</div></td>
                <td className="px-3 py-2 tabular-nums">{c.orders}</td>
                <td className="px-3 py-2 tabular-nums">{formatMxn(c.spent)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{new Date(c.lastOrder).toLocaleDateString("es-MX")}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">Aún sin clientes.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminError({ message }: { message: string }) {
  return <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{message}</p>;
}