import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetSettings, adminUpdateSettings } from "@/lib/admin.functions";
import { callAdminFn, formatAdminError } from "@/lib/admin-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/configuracion")({ component: Config });

function Config() {
  const get = useServerFn(adminGetSettings);
  const upd = useServerFn(adminUpdateSettings);
  const { data, refetch, isError, error } = useQuery({ queryKey: ["admin","settings"], queryFn: () => callAdminFn(get), retry: false });
  const [email, setEmail] = useState("");
  const [sendCustomer, setSendCustomer] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      setEmail(data.settings.admin_notification_email ?? "");
      setSendCustomer(data.settings.send_customer_email);
    }
  }, [data]);

  async function save() {
    setSaving(true);
    try {
      await callAdminFn(upd, { admin_notification_email: email || null, send_customer_email: sendCustomer });
      await refetch();
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-xl space-y-5">
      <h1 className="text-2xl font-extrabold">Configuración</h1>
      {isError && <AdminError message={formatAdminError(error)} />}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div>
          <Label htmlFor="email">Correo para notificaciones de pedidos</Label>
          <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1" placeholder="tu@correo.com" />
          <p className="mt-1 text-xs text-muted-foreground">Se envía un correo aquí cada vez que un pedido es aprobado por eCartPay.</p>
          {data?.adminEmailEnv && <p className="mt-1 text-xs text-muted-foreground">Configurado en variables de entorno: <code>{data.adminEmailEnv}</code></p>}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sendCustomer} onChange={(e)=>setSendCustomer(e.target.checked)} />
          Enviar correo de confirmación al cliente
        </label>
        <Button onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
      </div>
    </div>
  );
}

function AdminError({ message }: { message: string }) {
  return <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{message}</p>;
}