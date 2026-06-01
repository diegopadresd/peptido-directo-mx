import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminCrmSyncAll,
  adminCrmSyncCustomers,
  adminCrmSyncOrders,
  adminCrmSyncProducts,
} from "@/lib/admin.functions";
import { callAdminFn, formatAdminError } from "@/lib/admin-client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/crm-backfill")({
  head: () => ({ meta: [{ title: "CRM backfill · Admin" }, { name: "robots", content: "noindex" }] }),
  component: CrmBackfill,
});

type Result = { label: string; counts: Record<string, number> } | { label: string; error: string };

function CrmBackfill() {
  const products = useServerFn(adminCrmSyncProducts);
  const orders = useServerFn(adminCrmSyncOrders);
  const customers = useServerFn(adminCrmSyncCustomers);
  const all = useServerFn(adminCrmSyncAll);

  const [busy, setBusy] = useState<string | null>(null);
  const [log, setLog] = useState<Result[]>([]);

  async function run(label: string, fn: () => Promise<Record<string, number>>) {
    setBusy(label);
    try {
      const counts = await fn();
      setLog((l) => [{ label, counts }, ...l]);
    } catch (e) {
      setLog((l) => [{ label, error: formatAdminError(e) }, ...l]);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">CRM Backfill</h1>
        <p className="text-sm text-muted-foreground">
          Envía datos al CRM central. <strong>Reemplazar</strong> sustituye la entidad completa en el CRM por el snapshot enviado desde esta tienda.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          disabled={!!busy}
          onClick={() => run("Productos (reemplazar)", () => callAdminFn(products, { replace: true }))}
        >
          {busy === "Productos (reemplazar)" ? "Enviando…" : "Sincronizar productos (reemplazar)"}
        </Button>
        <Button
          disabled={!!busy}
          onClick={() => run("Pedidos (reemplazar)", () => callAdminFn(orders, { replace: true }))}
        >
          {busy === "Pedidos (reemplazar)" ? "Enviando…" : "Sincronizar pedidos (reemplazar)"}
        </Button>
        <Button
          disabled={!!busy}
          onClick={() => run("Clientes (reemplazar)", () => callAdminFn(customers, { replace: true }))}
        >
          {busy === "Clientes (reemplazar)" ? "Enviando…" : "Sincronizar clientes (reemplazar)"}
        </Button>
        <Button
          variant="default"
          disabled={!!busy}
          onClick={() => run("Todo (reemplazar)", () => callAdminFn(all, { replace: true }))}
        >
          {busy === "Todo (reemplazar)" ? "Enviando…" : "Sincronizar todo"}
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Resultados</h2>
        {log.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no ejecutas ninguna sincronización.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {log.map((r, i) => (
              <li key={i} className="rounded-md border border-border bg-background px-3 py-2">
                <div className="font-medium">{r.label}</div>
                {"error" in r ? (
                  <div className="text-destructive">Error: {r.error}</div>
                ) : (
                  <pre className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
                    {JSON.stringify(r.counts, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}