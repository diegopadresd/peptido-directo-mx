import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Acceso · Péptidos Mayoreo" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const fn = mode === "login" ? supabase.auth.signInWithPassword({ email, password }) : supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      const { error } = await fn;
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally { setLoading(false); }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-extrabold">{mode === "login" ? "Acceso administrador" : "Crear cuenta"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Solo cuentas con rol admin pueden ver el panel.</p>
      <form onSubmit={handle} className="mt-6 space-y-3 rounded-xl border border-border bg-card p-5">
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="mt-1" /></div>
        <div><Label htmlFor="password">Contraseña</Label><Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={8} className="mt-1" /></div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full rounded-full">{loading ? "..." : (mode === "login" ? "Entrar" : "Crear cuenta")}</Button>
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="block w-full text-xs text-muted-foreground hover:text-foreground">
          {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
        <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">← Volver al sitio</Link>
      </form>
    </div>
  );
}