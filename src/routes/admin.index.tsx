import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  Clock,
  DollarSign,
  Eye,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMxn } from "@/lib/pricing";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

const PAGE_SIZE = 1000;
const ABANDONED_CART_MS = 60 * 60 * 1000;
const PIE_COLORS = ["var(--primary)", "var(--accent)", "var(--secondary)", "var(--muted-foreground)"];

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

type PageViewRow = {
  session_id: string;
  path: string;
  created_at: string;
  device: string | null;
  referrer_host: string | null;
};

type EventRow = {
  session_id: string;
  name: string;
  product_slug: string | null;
  value_mxn: number | null;
  created_at: string;
};

type OrderRow = {
  id: string;
  created_at: string;
  status: string;
  total_mxn: number;
  customer_name: string;
  customer_email: string;
  shipping_status: string;
};

type CartRow = {
  id: string;
  created_at: string;
  last_seen_at: string;
  status: string;
  subtotal_mxn: number;
  email: string | null;
  customer_name: string | null;
  phone: string | null;
  items: unknown;
};

type DashboardData = {
  revenueToday: number;
  revenue7d: number;
  revenue30d: number;
  revenuePrev30d: number;
  ordersToday: number;
  orders7d: number;
  orders30d: number;
  aov: number;
  conversionRate: number;
  totalCustomers: number;
  newCustomers7d: number;
  activeSessions: number;
  ordersPending: number;
  cartsActive: number;
  abandonedCarts24h: number;
  visitors30d: number;
  productViews30d: number;
  cartsCreated30d: number;
  checkoutsStarted30d: number;
  paid30d: number;
  pageViews30d: number;
  analyticsEvents30d: number;
  pageViewsTotal: number;
  analyticsEventsTotal: number;
  ordersTotal: number;
  cartsTotal: number;
  lastPageviewAt: string | null;
  lastEventAt: string | null;
  lastCartAt: string | null;
  lastOrderAt: string | null;
  revenueDaily: { date: string; revenue: number }[];
  ordersByStatus: { name: string; value: number }[];
  topProducts: { slug: string; views: number }[];
  recentOrders: OrderRow[];
  recentVisits: PageViewRow[];
  recentEvents: EventRow[];
  abandonedCarts: CartRow[];
  generatedAt: string;
};

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);

  const fetchDashboard = async (mode: "initial" | "refresh" = "refresh") => {
    if (mode === "initial") setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const next = await loadDashboardData();
      setData(next);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard("initial");
    const refreshId = window.setInterval(() => fetchDashboard("refresh"), 30_000);
    const tickId = window.setInterval(() => setTick((value) => value + 1), 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchDashboard("refresh");
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(refreshId);
      window.clearInterval(tickId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  void tick;

  if (loading && !data) return <p className="text-sm text-muted-foreground">Cargando dashboard…</p>;
  if (error && !data) return <AdminError message={error} onRetry={() => fetchDashboard("refresh")} />;
  if (!data) return <AdminError message="El dashboard no devolvió datos." onRetry={() => fetchDashboard("refresh")} />;

  const secondsAgo = lastUpdated
    ? Math.max(0, Math.floor((Date.now() - lastUpdated.getTime()) / 1000))
    : 0;
  const revenueDelta = data.revenuePrev30d
    ? ((data.revenue30d - data.revenuePrev30d) / data.revenuePrev30d) * 100
    : 0;
  const funnel = [
    { label: "Visitantes", value: data.visitors30d },
    { label: "Vistas producto", value: data.productViews30d },
    { label: "Carritos", value: data.cartsCreated30d },
    { label: "Checkout", value: data.checkoutsStarted30d },
    { label: "Pagados", value: data.paid30d },
  ];
  const funnelMax = Math.max(1, ...funnel.map((item) => item.value));
  const kpis = [
    {
      title: "Ingresos 30d",
      value: formatMxn(data.revenue30d),
      sub: `${revenueDelta >= 0 ? "+" : ""}${revenueDelta.toFixed(1)}% vs 30d previos`,
      icon: DollarSign,
      tone: "text-primary",
    },
    {
      title: "Hoy",
      value: formatMxn(data.revenueToday),
      sub: `${data.ordersToday} pedidos · ${data.activeSessions} sesiones activas`,
      icon: TrendingUp,
      tone: "text-emerald-500",
    },
    {
      title: "Pedidos 30d",
      value: String(data.orders30d),
      sub: `${data.orders7d} últimos 7d · ${data.ordersPending} pendientes`,
      icon: ShoppingCart,
      tone: "text-blue-500",
    },
    {
      title: "Ticket promedio",
      value: formatMxn(data.aov),
      sub: "Promedio de pedidos pagados",
      icon: DollarSign,
      tone: "text-violet-500",
    },
    {
      title: "Conversión",
      value: `${data.conversionRate.toFixed(2)}%`,
      sub: "Pagos / sesiones 30d",
      icon: Activity,
      tone: "text-pink-500",
    },
    {
      title: "Clientes",
      value: String(data.totalCustomers),
      sub: `+${data.newCustomers7d} nuevos en 7d`,
      icon: Users,
      tone: "text-green-500",
    },
    {
      title: "Visitas 30d",
      value: String(data.pageViews30d),
      sub: `${data.visitors30d} sesiones únicas en 30d`,
      icon: Eye,
      tone: "text-cyan-500",
    },
    {
      title: "Carritos abandonados",
      value: String(data.abandonedCarts24h),
      sub: "Últimas 24h sin convertir",
      icon: AlertCircle,
      tone: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Actualizado hace {secondsAgo}s · auto-refresh 30s · fuente directa con sesión admin
          </p>
        </div>
        <button
          onClick={() => fetchDashboard("refresh")}
          disabled={refreshing}
          className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-50"
        >
          {refreshing ? "Actualizando…" : "Actualizar"}
        </button>
      </div>

      {error && <AdminError message={error} onRetry={() => fetchDashboard("refresh")} compact />}
      <RawCounts data={data} />
      <HealthBar data={data} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.tone}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl font-bold tabular-nums">{kpi.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Funnel de conversión (30d)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnel.map((step, index) => {
              const pct = (step.value / funnelMax) * 100;
              const previous = index > 0 ? funnel[index - 1].value : step.value;
              const drop = index > 0 && previous > 0 ? ((previous - step.value) / previous) * 100 : 0;
              return (
                <div key={step.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{step.label}</span>
                    <span className="text-muted-foreground">
                      {step.value.toLocaleString("es-MX")}
                      {index > 0 && previous > 0 && (
                        <span className="ml-2 text-xs">(-{Math.max(0, drop).toFixed(0)}%)</span>
                      )}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ingresos diarios (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.revenueDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip content={<ChartTooltip money />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pedidos por estado</CardTitle>
          </CardHeader>
          <CardContent>
            {data.ordersByStatus.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Sin pedidos aún</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.ordersByStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                    {data.ordersByStatus.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Productos más vistos (30d)</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Sin vistas de productos aún</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.topProducts} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="slug" tick={{ fontSize: 11 }} width={150} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="views" fill="var(--primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentOrders rows={data.recentOrders} />
        <RecentActivity title="Últimas visitas" rows={data.recentVisits} kind="visits" />
        <RecentActivity title="Últimos eventos" rows={data.recentEvents} kind="events" />
        <AbandonedCarts rows={data.abandonedCarts} />
      </div>
    </div>
  );
}

async function loadDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const today = startOfDay(now);
  const d7 = daysAgo(7);
  const d30 = daysAgo(30);
  const d60 = daysAgo(60);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const [orders, carts, pageViews, events, counts] = await Promise.all([
    fetchOrdersSince(d60),
    fetchCarts(),
    fetchPageViewsSince(d30),
    fetchEventsSince(d30),
    fetchRawCounts(),
  ]);

  const approvedOrders = orders.filter((order) => order.status === "approved");
  const revenueToday = sumRevenue(approvedOrders.filter((order) => new Date(order.created_at) >= today));
  const revenue7d = sumRevenue(approvedOrders.filter((order) => new Date(order.created_at) >= d7));
  const revenue30d = sumRevenue(approvedOrders.filter((order) => new Date(order.created_at) >= d30));
  const revenuePrev30d = sumRevenue(
    approvedOrders.filter((order) => {
      const date = new Date(order.created_at);
      return date >= d60 && date < d30;
    }),
  );
  const paid30dRows = approvedOrders.filter((order) => new Date(order.created_at) >= d30);
  const sessions30d = new Set(pageViews.map((view) => view.session_id)).size;
  const activeSessions = new Set(
    pageViews.filter((view) => new Date(view.created_at) >= oneHourAgo).map((view) => view.session_id),
  ).size;
  const customerEmails = new Set(orders.map((order) => order.customer_email).filter(Boolean));
  const newCustomers7d = new Set(
    orders
      .filter((order) => new Date(order.created_at) >= d7)
      .map((order) => order.customer_email)
      .filter(Boolean),
  ).size;
  const productViewEvents = events.filter((event) => event.name === "view_product");
  const cartEvents = events.filter((event) => event.name === "add_to_cart");
  const checkoutEvents = events.filter((event) => event.name === "begin_checkout");
  const abandonedCarts = carts
    .filter((cart) => cart.status !== "converted")
    .filter((cart) => now.getTime() - new Date(cart.last_seen_at).getTime() > ABANDONED_CART_MS)
    .sort((a, b) => new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime())
    .slice(0, 8);

  const revenueByDay = new Map<string, number>();
  for (let i = 29; i >= 0; i -= 1) {
    const day = startOfDay(daysAgo(i)).toISOString().slice(0, 10);
    revenueByDay.set(day, 0);
  }
  paid30dRows.forEach((order) => {
    const day = startOfDay(new Date(order.created_at)).toISOString().slice(0, 10);
    revenueByDay.set(day, (revenueByDay.get(day) ?? 0) + order.total_mxn);
  });

  const statusMap = new Map<string, number>();
  orders.forEach((order) => statusMap.set(order.status, (statusMap.get(order.status) ?? 0) + 1));

  const topProductMap = new Map<string, number>();
  productViewEvents.forEach((event) => {
    if (!event.product_slug) return;
    topProductMap.set(event.product_slug, (topProductMap.get(event.product_slug) ?? 0) + 1);
  });

  return {
    revenueToday,
    revenue7d,
    revenue30d,
    revenuePrev30d,
    ordersToday: approvedOrders.filter((order) => new Date(order.created_at) >= today).length,
    orders7d: approvedOrders.filter((order) => new Date(order.created_at) >= d7).length,
    orders30d: paid30dRows.length,
    aov: approvedOrders.length ? Math.round(sumRevenue(approvedOrders) / approvedOrders.length) : 0,
    conversionRate: sessions30d ? (paid30dRows.length / sessions30d) * 100 : 0,
    totalCustomers: customerEmails.size,
    newCustomers7d,
    activeSessions,
    ordersPending: orders.filter((order) => order.status === "pending").length,
    cartsActive: carts.filter((cart) => cart.status !== "converted" && new Date(cart.last_seen_at) >= oneHourAgo).length,
    abandonedCarts24h: abandonedCarts.filter((cart) => new Date(cart.last_seen_at) >= daysAgo(1)).length,
    visitors30d: sessions30d,
    productViews30d: productViewEvents.length,
    cartsCreated30d: new Set(cartEvents.map((event) => event.session_id)).size,
    checkoutsStarted30d: checkoutEvents.length,
    paid30d: paid30dRows.length,
    pageViews30d: pageViews.length,
    analyticsEvents30d: events.length,
    pageViewsTotal: counts.pageViewsTotal,
    analyticsEventsTotal: counts.analyticsEventsTotal,
    ordersTotal: counts.ordersTotal,
    cartsTotal: counts.cartsTotal,
    lastPageviewAt: pageViews[0]?.created_at ?? null,
    lastEventAt: events[0]?.created_at ?? null,
    lastCartAt: carts[0]?.last_seen_at ?? null,
    lastOrderAt: orders[0]?.created_at ?? null,
    revenueDaily: Array.from(revenueByDay.entries()).map(([date, revenue]) => ({
      date: new Date(`${date}T00:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
      revenue,
    })),
    ordersByStatus: Array.from(statusMap.entries()).map(([name, value]) => ({ name, value })),
    topProducts: Array.from(topProductMap.entries())
      .map(([slug, views]) => ({ slug, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8),
    recentOrders: orders.slice(0, 6),
    recentVisits: pageViews.slice(0, 8),
    recentEvents: events.slice(0, 8),
    abandonedCarts,
    generatedAt: new Date().toISOString(),
  };
}

async function fetchRawCounts() {
  const [pageViews, analyticsEvents, orders, carts] = await Promise.all([
    supabase.from("page_views").select("*", { count: "exact", head: true }),
    supabase.from("analytics_events").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("carts").select("*", { count: "exact", head: true }),
  ]);
  return {
    pageViewsTotal: exactCount("page_views total", pageViews.count, pageViews.error),
    analyticsEventsTotal: exactCount("analytics_events total", analyticsEvents.count, analyticsEvents.error),
    ordersTotal: exactCount("orders total", orders.count, orders.error),
    cartsTotal: exactCount("carts total", carts.count, carts.error),
  };
}

async function fetchPageViewsSince(since: Date) {
  const rows: PageViewRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("page_views")
      .select("session_id, path, created_at, device, referrer_host")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`page_views 30d: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return rows;
}

async function fetchEventsSince(since: Date) {
  const rows: EventRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("analytics_events")
      .select("session_id, name, product_slug, value_mxn, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`analytics_events 30d: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return rows;
}

async function fetchOrdersSince(since: Date) {
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, status, total_mxn, customer_name, customer_email, shipping_status")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) throw new Error(`orders 60d: ${error.message}`);
  return data ?? [];
}

async function fetchCarts() {
  const { data, error } = await supabase
    .from("carts")
    .select("id, created_at, last_seen_at, status, subtotal_mxn, email, customer_name, phone, items")
    .order("last_seen_at", { ascending: false })
    .limit(5000);
  if (error) throw new Error(`carts: ${error.message}`);
  return data ?? [];
}

function exactCount(label: string, count: number | null, error: { message?: string } | null) {
  if (error) throw new Error(`${label}: ${error.message}`);
  if (typeof count !== "number") throw new Error(`${label}: la base no devolvió conteo exacto`);
  return count;
}

function sumRevenue(rows: OrderRow[]) {
  return rows.reduce((sum, order) => sum + Number(order.total_mxn ?? 0), 0);
}

function AdminError({
  message,
  onRetry,
  compact,
}: {
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}) {
  return (
    <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      <p className="font-semibold">Error cargando el dashboard</p>
      <p className="text-xs">{message}</p>
      {onRetry && !compact && (
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

function RawCounts({ data }: { data: DashboardData }) {
  const items = [
    { label: "page_views total", value: data.pageViewsTotal },
    { label: "analytics_events total", value: data.analyticsEventsTotal },
    { label: "page_views 30d", value: data.pageViews30d },
    { label: "analytics_events 30d", value: data.analyticsEvents30d },
    { label: "orders total", value: data.ordersTotal },
    { label: "carts total", value: data.cartsTotal },
  ];
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Datos reales leídos desde la base
        </p>
        <p className="text-[10px] text-muted-foreground">
          Lectura: {new Date(data.generatedAt).toLocaleString("es-MX")}
        </p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[10px] text-muted-foreground">{item.label}</p>
            <p className="text-lg font-extrabold tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthBar({ data }: { data: DashboardData }) {
  const items = [
    { label: "Última visita", ts: data.lastPageviewAt },
    { label: "Último evento", ts: data.lastEventAt },
    { label: "Último carrito", ts: data.lastCartAt },
    { label: "Último pedido", ts: data.lastOrderAt },
  ];
  return (
    <div className="grid gap-2 rounded-xl border border-border bg-card p-3 sm:grid-cols-4">
      {items.map((item) => {
        const fresh = item.ts && Date.now() - new Date(item.ts).getTime() < 24 * 60 * 60 * 1000;
        const stale = item.ts && !fresh;
        return (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${fresh ? "bg-emerald-500" : stale ? "bg-amber-500" : "bg-muted-foreground/40"}`}
            />
            <span className="text-muted-foreground">{item.label}:</span>
            <span className="font-medium">
              {item.ts ? new Date(item.ts).toLocaleString("es-MX") : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RecentOrders({ rows }: { rows: OrderRow[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pedidos recientes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Sin pedidos.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">ID</th>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">Total</th>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="border-b border-border/40 hover:bg-secondary/20">
                  <td className="px-4 py-2">
                    <Link
                      to="/admin/pedidos/$id"
                      params={{ id: order.id }}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      {order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="p-2 tabular-nums">{formatMxn(order.total_mxn)}</td>
                  <td className="p-2">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{order.status}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("es-MX")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivity({
  title,
  rows,
  kind,
}: {
  title: string;
  rows: PageViewRow[] | EventRow[];
  kind: "visits" | "events";
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos.</p>
        ) : (
          <ul className="space-y-2 text-xs">
            {rows.map((row, index) => {
              const label = kind === "visits" ? (row as PageViewRow).path : (row as EventRow).name;
              const detail =
                kind === "visits"
                  ? ((row as PageViewRow).device ?? "desconocido")
                  : ((row as EventRow).product_slug ?? "—");
              return (
                <li key={`${label}-${index}`} className="flex justify-between gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <span className="min-w-0 truncate">
                    <strong>{label}</strong> · {detail}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {new Date(row.created_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function AbandonedCarts({ rows }: { rows: CartRow[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" /> Carritos abandonados
        </CardTitle>
        <span className="text-xs text-muted-foreground">{rows.length} carritos</span>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No hay carritos abandonados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">Subtotal</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Última actividad</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((cart) => (
                <tr key={cart.id} className="border-b border-border/40">
                  <td className="px-4 py-2">
                    <div className="truncate font-medium">{cart.customer_name || "(anónimo)"}</div>
                    <div className="truncate text-xs text-muted-foreground">{cart.email || cart.phone || "—"}</div>
                  </td>
                  <td className="p-2 tabular-nums">{formatMxn(cart.subtotal_mxn)}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {new Date(cart.last_seen_at).toLocaleString("es-MX", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

function ChartTooltip({ active, payload, label, money }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-background p-2 text-xs shadow">
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((item: any) => (
        <p key={item.name} className="tabular-nums text-muted-foreground">
          {item.name}: {money ? formatMxn(Number(item.value)) : item.value}
        </p>
      ))}
    </div>
  );
}
