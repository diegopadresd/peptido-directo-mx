import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetDashboard } from "@/lib/admin.functions";
import { callAdminFn, formatAdminError } from "@/lib/admin-client";
import { formatMxn } from "@/lib/pricing";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const fn = useServerFn(adminGetDashboard);
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["admin","dashboard"], queryFn: () => callAdminFn(fn), staleTime: 60_000, retry: false });
  if (isError) return <AdminError message={formatAdminError(error)} />;
  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  const dashboard = normalizeDashboard(data);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ingresos hoy" value={formatMxn(dashboard.revenue.d1)} />
        <Stat label="Ingresos 7d" value={formatMxn(dashboard.revenue.d7)} />
        <Stat label="Ingresos 30d" value={formatMxn(dashboard.revenue.d30)} />
        <Stat label="Ticket promedio" value={formatMxn(dashboard.avgTicket)} />
        <Stat label="Pedidos pagados" value={String(dashboard.counts.ordersApproved)} />
        <Stat label="Pedidos pendientes" value={String(dashboard.counts.ordersPending)} />
        <Stat label="Carritos activos" value={String(dashboard.counts.cartsActive)} />
        <Stat label="Carritos abandonados" value={String(dashboard.counts.cartsAbandoned)} />
        <Stat label="Visitas hoy" value={String(dashboard.visits.pv_d1)} />
        <Stat label="Visitas 7d" value={String(dashboard.visits.pv_d7)} />
        <Stat label="Visitas 30d" value={String(dashboard.visits.pv_d30)} />
        <Stat label="Sesiones 30d" value={String(dashboard.visits.sess_d30)} />
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pedidos pagados (últimos 30 días)</h2>
        {dashboard.daily.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Aún sin datos.</p> : (
          <ul className="mt-3 space-y-1 text-sm">
            {dashboard.daily.map((d) => (
              <li key={d.day} className="flex justify-between"><span>{d.day}</span><span className="tabular-nums">{d.count} · {formatMxn(d.revenue)}</span></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

type DashboardData = {
  revenue: { d1: number; d7: number; d30: number };
  counts: { ordersTotal: number; ordersApproved: number; ordersPending: number; cartsActive: number; cartsAbandoned: number };
  avgTicket: number;
  visits: { pv_d1: number; pv_d7: number; pv_d30: number; sess_d1: number; sess_d7: number; sess_d30: number };
  daily: { day: string; count: number; revenue: number }[];
};

function normalizeDashboard(data: Partial<DashboardData>): DashboardData {
  return {
    revenue: { d1: data.revenue?.d1 ?? 0, d7: data.revenue?.d7 ?? 0, d30: data.revenue?.d30 ?? 0 },
    counts: {
      ordersTotal: data.counts?.ordersTotal ?? 0,
      ordersApproved: data.counts?.ordersApproved ?? 0,
      ordersPending: data.counts?.ordersPending ?? 0,
      cartsActive: data.counts?.cartsActive ?? 0,
      cartsAbandoned: data.counts?.cartsAbandoned ?? 0,
    },
    avgTicket: data.avgTicket ?? 0,
    visits: {
      pv_d1: data.visits?.pv_d1 ?? 0,
      pv_d7: data.visits?.pv_d7 ?? 0,
      pv_d30: data.visits?.pv_d30 ?? 0,
      sess_d1: data.visits?.sess_d1 ?? 0,
      sess_d7: data.visits?.sess_d7 ?? 0,
      sess_d30: data.visits?.sess_d30 ?? 0,
    },
    daily: data.daily ?? [],
  };
}

function AdminError({ message }: { message: string }) {
  return <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{message}</p>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}