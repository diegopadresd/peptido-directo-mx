import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetDashboard } from "@/lib/admin.functions";
import { callAdminFn, formatAdminError } from "@/lib/admin-client";
import { formatMxn } from "@/lib/pricing";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const fn = useServerFn(adminGetDashboard);
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => callAdminFn(fn),
    staleTime: 30_000,
    retry: false,
  });
  if (isError) return <AdminError message={formatAdminError(error)} onRetry={() => refetch()} />;
  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  const validated = validateDashboardData(data);
  if (typeof validated === "string")
    return <AdminError message={validated} onRetry={() => refetch()} />;
  const dashboard = validated;
  const trackingHealthy = dashboard.visits.pv_d7 > 0;
  const noOrders = dashboard.counts.ordersTotal === 0;
  const noCarts = dashboard.counts.cartsActive + dashboard.counts.cartsAbandoned === 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Tracking: {trackingHealthy ? "✅ activo" : "⚠️ sin visitas en 7d"} · Pedidos:{" "}
            {noOrders ? "0 (aún sin ventas)" : `${dashboard.counts.ordersTotal} totales`} ·
            Carritos:{" "}
            {noCarts
              ? "0 (aún sin actividad guardada)"
              : `${dashboard.counts.cartsActive + dashboard.counts.cartsAbandoned} guardados`}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-50"
        >
          {isFetching ? "Actualizando…" : "Actualizar"}
        </button>
      </div>
      <RawCounts r={dashboard.raw} />
      <HealthBar h={dashboard.health} />
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Pedidos recientes" cta={{ label: "Ver todos", to: "/admin/pedidos" }}>
          {dashboard.recentOrders.length === 0 ? (
            <Empty text="Aún no hay pedidos." />
          ) : (
            <ul className="divide-y divide-border text-sm">
              {dashboard.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2">
                  <Link to="/admin/pedidos/$id" params={{ id: o.id }} className="min-w-0 flex-1">
                    <p className="truncate font-medium">{o.customer_name || "—"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.customer_email} · {new Date(o.created_at).toLocaleString("es-MX")}
                    </p>
                  </Link>
                  <div className="ml-3 text-right">
                    <p className="tabular-nums font-bold">{formatMxn(o.total_mxn)}</p>
                    <p className="text-[10px] uppercase text-muted-foreground">
                      {o.status} · {o.shipping_status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Productos más vistos (30d)"
          cta={{ label: "Analytics", to: "/admin/analytics" }}
        >
          {dashboard.topProducts30d.length === 0 ? (
            <Empty text="Aún sin vistas de productos." />
          ) : (
            <ul className="space-y-1 text-sm">
              {dashboard.topProducts30d.map((p) => (
                <li key={p.slug} className="flex justify-between">
                  <span className="truncate">{p.slug}</span>
                  <span className="tabular-nums text-muted-foreground">{p.views}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Últimas visitas">
          {dashboard.recentVisits.length === 0 ? (
            <Empty text="Sin visitas registradas." />
          ) : (
            <ul className="space-y-1 text-xs">
              {dashboard.recentVisits.map((v, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="truncate">{v.path}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {new Date(v.created_at).toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · {v.device ?? "?"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Últimos eventos">
          {dashboard.recentEvents.length === 0 ? (
            <Empty text="Sin eventos." />
          ) : (
            <ul className="space-y-1 text-xs">
              {dashboard.recentEvents.map((e, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="truncate">
                    <strong>{e.name}</strong>
                    {e.product_slug ? ` · ${e.product_slug}` : ""}
                    {e.value_mxn ? ` · ${formatMxn(e.value_mxn)}` : ""}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {new Date(e.created_at).toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Pedidos pagados (últimos 30 días)
        </h2>
        {dashboard.daily.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Aún sin datos.</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm">
            {dashboard.daily.map((d) => (
              <li key={d.day} className="flex justify-between">
                <span>{d.day}</span>
                <span className="tabular-nums">
                  {d.count} · {formatMxn(d.revenue)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

type DashboardData = {
  revenue: { d1: number; d7: number; d30: number };
  counts: {
    ordersTotal: number;
    ordersApproved: number;
    ordersPending: number;
    cartsActive: number;
    cartsAbandoned: number;
  };
  avgTicket: number;
  visits: {
    pv_d1: number;
    pv_d7: number;
    pv_d30: number;
    sess_d1: number;
    sess_d7: number;
    sess_d30: number;
  };
  daily: { day: string; count: number; revenue: number }[];
  recentOrders: {
    id: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    total_mxn: number;
    status: string;
    shipping_status: string;
  }[];
  topProducts30d: { slug: string; views: number }[];
  recentVisits: {
    path: string;
    created_at: string;
    device: string | null;
    referrer_host: string | null;
  }[];
  recentEvents: {
    name: string;
    product_slug: string | null;
    value_mxn: number | null;
    created_at: string;
  }[];
  health: {
    lastPageviewAt: string | null;
    lastEventAt: string | null;
    lastOrderAt: string | null;
    lastCartAt: string | null;
  };
  raw: {
    pageViewsTotal: number;
    analyticsEventsTotal: number;
    ordersTotalRaw: number;
    cartsTotalRaw: number;
    generatedAt: string;
  };
};

function validateDashboardData(data: unknown): DashboardData | string {
  const payload = unwrapServerPayload(data);
  if (!isRecord(payload)) return "El servidor no devolvió un dashboard válido.";
  const requiredObjects = ["revenue", "counts", "visits", "health", "raw"] as const;
  for (const key of requiredObjects)
    if (!isRecord(payload[key])) return `Respuesta incompleta: falta ${key}.`;
  const requiredArrays = [
    "daily",
    "recentOrders",
    "topProducts30d",
    "recentVisits",
    "recentEvents",
  ] as const;
  for (const key of requiredArrays)
    if (!Array.isArray(payload[key])) return `Respuesta incompleta: falta ${key}.`;
  const numericPaths = [
    ["revenue", "d1"],
    ["revenue", "d7"],
    ["revenue", "d30"],
    ["counts", "ordersTotal"],
    ["counts", "ordersApproved"],
    ["counts", "ordersPending"],
    ["counts", "cartsActive"],
    ["counts", "cartsAbandoned"],
    ["visits", "pv_d1"],
    ["visits", "pv_d7"],
    ["visits", "pv_d30"],
    ["visits", "sess_d1"],
    ["visits", "sess_d7"],
    ["visits", "sess_d30"],
    ["raw", "pageViewsTotal"],
    ["raw", "analyticsEventsTotal"],
    ["raw", "ordersTotalRaw"],
    ["raw", "cartsTotalRaw"],
  ] as const;
  for (const [obj, key] of numericPaths) {
    const parent = payload[obj];
    if (!isRecord(parent) || typeof parent[key] !== "number")
      return `Respuesta incompleta: ${obj}.${key} no es numérico.`;
  }
  if (typeof payload.avgTicket !== "number") return "Respuesta incompleta: avgTicket no es numérico.";
  const raw = payload.raw;
  if (!isRecord(raw) || typeof raw.generatedAt !== "string")
    return "Respuesta incompleta: falta raw.generatedAt.";
  return payload as DashboardData;
}

function unwrapServerPayload(data: unknown): unknown {
  if (!isRecord(data)) return data;
  if (isRecord(data.revenue) && isRecord(data.counts)) return data;
  if (isRecord(data.result)) return unwrapServerPayload(data.result);
  if (isRecord(data.data)) return unwrapServerPayload(data.data);
  return data;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function AdminError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      <p className="font-semibold">Error cargando el dashboard</p>
      <p className="text-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded border border-destructive/40 px-2 py-1 text-xs hover:bg-destructive/20"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

function RawCounts({ r }: { r: DashboardData["raw"] }) {
  const items = [
    { label: "page_views (total)", value: r.pageViewsTotal },
    { label: "analytics_events (total)", value: r.analyticsEventsTotal },
    { label: "orders (total)", value: r.ordersTotalRaw },
    { label: "carts (total)", value: r.cartsTotalRaw },
  ];
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Datos crudos en la base
        </p>
        <p className="text-[10px] text-muted-foreground">
          Servidor: {new Date(r.generatedAt).toLocaleString("es-MX")}
        </p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.label}>
            <p className="text-[10px] text-muted-foreground">{it.label}</p>
            <p className="text-lg font-extrabold tabular-nums">{it.value}</p>
          </div>
        ))}
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

function Panel({
  title,
  cta,
  children,
}: {
  title: string;
  cta?: { label: string; to: string };
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
        {cta && (
          <Link to={cta.to} className="text-xs font-medium text-primary hover:underline">
            {cta.label}
          </Link>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground">{text}</p>;
}

function HealthBar({ h }: { h: DashboardData["health"] }) {
  const items: { label: string; ts: string | null }[] = [
    { label: "Última visita", ts: h.lastPageviewAt },
    { label: "Último evento", ts: h.lastEventAt },
    { label: "Último pedido", ts: h.lastOrderAt },
    { label: "Último carrito", ts: h.lastCartAt },
  ];
  return (
    <div className="grid gap-2 rounded-xl border border-border bg-card p-3 sm:grid-cols-4">
      {items.map((it) => {
        const fresh = it.ts && Date.now() - new Date(it.ts).getTime() < 24 * 60 * 60 * 1000;
        const stale = it.ts && !fresh;
        return (
          <div key={it.label} className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${fresh ? "bg-emerald-500" : stale ? "bg-amber-500" : "bg-muted-foreground/40"}`}
            />
            <span className="text-muted-foreground">{it.label}:</span>
            <span className="font-medium">
              {it.ts ? new Date(it.ts).toLocaleString("es-MX") : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
