import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetDashboard } from "@/lib/admin.functions";
import { formatMxn } from "@/lib/pricing";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const fn = useServerFn(adminGetDashboard);
  const { data, isLoading } = useQuery({ queryKey: ["admin","dashboard"], queryFn: () => fn(), staleTime: 60_000 });
  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ingresos hoy" value={formatMxn(data.revenue.d1)} />
        <Stat label="Ingresos 7d" value={formatMxn(data.revenue.d7)} />
        <Stat label="Ingresos 30d" value={formatMxn(data.revenue.d30)} />
        <Stat label="Ticket promedio" value={formatMxn(data.avgTicket)} />
        <Stat label="Pedidos pagados" value={String(data.counts.ordersApproved)} />
        <Stat label="Pedidos pendientes" value={String(data.counts.ordersPending)} />
        <Stat label="Carritos activos" value={String(data.counts.cartsActive)} />
        <Stat label="Carritos abandonados" value={String(data.counts.cartsAbandoned)} />
        <Stat label="Visitas hoy" value={String(data.visits?.pv_d1 ?? 0)} />
        <Stat label="Visitas 7d" value={String(data.visits?.pv_d7 ?? 0)} />
        <Stat label="Visitas 30d" value={String(data.visits?.pv_d30 ?? 0)} />
        <Stat label="Sesiones 30d" value={String(data.visits?.sess_d30 ?? 0)} />
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pedidos pagados (últimos 30 días)</h2>
        {data.daily.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Aún sin datos.</p> : (
          <ul className="mt-3 space-y-1 text-sm">
            {data.daily.map((d) => (
              <li key={d.day} className="flex justify-between"><span>{d.day}</span><span className="tabular-nums">{d.count} · {formatMxn(d.revenue)}</span></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}