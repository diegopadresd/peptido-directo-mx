import { createFileRoute, redirect, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, ShoppingBag, Users, ShoppingCart, Settings, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Péptidos Mayoreo" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/login" }); return; }
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (cancelled) return;
      if (error || !data) { navigate({ to: "/" }); return; }
      setAllowed(true); setReady(true);
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  if (!ready) {
    return <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Verificando acceso…</div>;
  }
  if (!allowed) return null;

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
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