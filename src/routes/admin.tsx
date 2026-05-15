import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, ShoppingBag, Users, ShoppingCart, Settings, LogOut, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Péptidos Mayoreo" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

type Status = "loading" | "no-session" | "no-role" | "error" | "ok";

function AdminLayout() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (!userId) { if (!cancelled) setStatus("no-session"); return; }
        const { data: isAdmin, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
        if (cancelled) return;
        if (error) { setErrorMsg(error.message); setStatus("error"); return; }
        setStatus(isAdmin ? "ok" : "no-role");
      } catch (e) {
        if (cancelled) return;
        setErrorMsg(e instanceof Error ? e.message : "Error desconocido");
        setStatus("error");
      }
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") check();
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (status === "no-session") navigate({ to: "/login" });
  }, [status, navigate]);

  if (status === "loading") {
    return (
      <div className="grid min-h-[60vh] place-items-center gap-3 text-center text-sm text-muted-foreground">
        <p>Verificando acceso…</p>
        <button onClick={() => window.location.reload()} className="text-xs text-primary hover:underline">Recargar si tarda más de 5s</button>
      </div>
    );
  }
  if (status !== "ok") {
    const msg =
      status === "no-session" ? "Necesitas iniciar sesión." :
      status === "no-role" ? "Esta cuenta no tiene rol admin." :
      errorMsg ?? "No se pudo verificar tu acceso.";
    return (
      <div className="container mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{msg}</p>
          <button onClick={() => navigate({ to: "/login" })} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Ir a login</button>
        </div>
      </div>
    );
  }

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { to: "/admin/carritos", label: "Carritos abandonados", icon: ShoppingCart },
    { to: "/admin/clientes", label: "Clientes", icon: Users },
    { to: "/admin/configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-20 h-fit space-y-1">
        <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Panel admin</p>
        {links.map((l) => {
          const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
          return (
            <Link key={l.to} to={l.to} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          );
        })}
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }}
          className="mt-4 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Salir
        </button>
      </aside>
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}