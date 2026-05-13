import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { adminGetAnalytics } from "@/lib/admin.functions";
import { callAdminFn, formatAdminError } from "@/lib/admin-client";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const fn = useServerFn(adminGetAnalytics);
  const [days, setDays] = useState(30);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "analytics", days],
    queryFn: () => callAdminFn(fn, { days }),
    retry: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Analytics</h1>
        <div className="flex gap-1 rounded-md border border-border p-1">
          {[1, 7, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className={`rounded px-3 py-1 text-xs font-semibold ${days === d ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {isError ? <AdminError message={formatAdminError(error)} /> : isLoading ? <p className="text-sm text-muted-foreground">Cargando…</p> : !data ? <AdminError message={formatAdminError(null)} /> : (() => {
        const d = {
          funnel: data.funnel ?? {},
          topPages: data.topPages ?? [],
          topReferrers: data.topReferrers ?? [],
          devices: data.devices ?? [],
          utm: data.utm ?? [],
          topProducts: data.topProducts ?? [],
          addToCart: data.addToCart ?? [],
          searches: data.searches ?? [],
          daily: data.daily ?? [],
        };
        return (
        <>
          <Funnel f={d.funnel} />

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Páginas más vistas">
              <Table rows={d.topPages.map((r) => ({ k: r.path, v: `${r.views} (${r.sessions} sesiones)` }))} empty="Aún sin datos" />
            </Card>
            <Card title="Referrers">
              <Table rows={d.topReferrers.map((r) => ({ k: r.host, v: String(r.visits) }))} empty="Aún sin datos" />
            </Card>
            <Card title="Dispositivos">
              <Table rows={d.devices.map((r) => ({ k: r.device, v: String(r.visits) }))} empty="Aún sin datos" />
            </Card>
            <Card title="UTM (campañas)">
              <Table rows={d.utm.map((r) => ({ k: `${r.source}/${r.medium}/${r.campaign}`, v: String(r.visits) }))} empty="Sin tráfico con UTM" />
            </Card>
            <Card title="Productos más vistos">
              <Table rows={d.topProducts.map((r) => ({ k: r.slug, v: String(r.views) }))} empty="Aún sin datos" />
            </Card>
            <Card title="Más añadidos al carrito">
              <Table rows={d.addToCart.map((r) => ({ k: r.slug, v: String(r.count) }))} empty="Aún sin datos" />
            </Card>
            <Card title="Búsquedas">
              <Table rows={d.searches.map((r) => ({ k: r.q, v: String(r.count) }))} empty="Aún sin datos" />
            </Card>
            <Card title="Vistas por día">
              <Table rows={d.daily.map((r) => ({ k: r.day, v: `${r.views} vistas · ${r.sessions} sesiones` }))} empty="Aún sin datos" />
            </Card>
          </div>
        </>
        );
      })()}
    </div>
  );
}

function AdminError({ message }: { message: string }) {
  return <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{message}</p>;
}

function Funnel({ f }: { f: Record<string, number> }) {
  const steps: { label: string; key: string }[] = [
    { label: "Sesiones", key: "sessions" },
    { label: "Vio producto", key: "view_product" },
    { label: "Añadió al carrito", key: "add_to_cart" },
    { label: "Inició checkout", key: "begin_checkout" },
    { label: "Pedidos creados", key: "orders_pending" },
    { label: "Pedidos pagados", key: "orders_approved" },
  ];
  const max = Math.max(1, ...steps.map((s) => f[s.key] ?? 0));
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Embudo de conversión</h2>
      <div className="mt-4 space-y-2">
        {steps.map((s) => {
          const v = f[s.key] ?? 0;
          const pct = (v / max) * 100;
          return (
            <div key={s.key} className="flex items-center gap-3">
              <span className="w-44 text-xs text-muted-foreground">{s.label}</span>
              <div className="relative h-6 flex-1 overflow-hidden rounded bg-muted">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-12 text-right text-sm font-bold tabular-nums">{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Table({ rows, empty }: { rows: { k: string; v: string }[]; empty: string }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-1 text-sm">
      {rows.map((r, i) => (
        <li key={i} className="flex justify-between gap-3">
          <span className="truncate">{r.k}</span>
          <span className="tabular-nums text-muted-foreground">{r.v}</span>
        </li>
      ))}
    </ul>
  );
}