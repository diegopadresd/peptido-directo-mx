import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGetOrder, adminUpdateOrder } from "@/lib/admin.functions";
import { callAdminFn, formatAdminError } from "@/lib/admin-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatMxn } from "@/lib/pricing";
import { Copy, Printer } from "lucide-react";

export const Route = createFileRoute("/admin/pedidos/$id")({ component: OrderDetail });

function OrderDetail() {
  const { id } = Route.useParams();
  const fn = useServerFn(adminGetOrder);
  const upd = useServerFn(adminUpdateOrder);
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["admin","order", id], queryFn: () => callAdminFn(fn, { id }), retry: false });

  const [shippingStatus, setShippingStatus] = useState("pendiente");
  const [carrier, setCarrier] = useState("Estafeta");
  const [tracking, setTracking] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.order) {
      setShippingStatus(data.order.shipping_status ?? "pendiente");
      setCarrier(data.order.carrier ?? "Estafeta");
      setTracking(data.order.tracking_number ?? "");
      setAdminNotes(data.order.admin_notes ?? "");
    }
  }, [data]);

  if (isError) return <AdminError message={formatAdminError(error)} />;
  if (isLoading || !data?.order) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  const o = data.order;
  const a = (o.customer_address ?? {}) as Record<string, string>;
  const fullAddress = `${o.customer_name}\n${a.street ?? ""} ${a.extNumber ?? ""}${a.intNumber ? ` int. ${a.intNumber}` : ""}\nCol. ${a.neighborhood ?? ""}\nCP ${a.postalCode ?? ""}, ${a.city ?? ""}, ${a.state ?? ""}\nTel: ${o.customer_phone}\n${a.references ? `Ref: ${a.references}` : ""}`;

  async function copyAddress() {
    try { await navigator.clipboard.writeText(fullAddress); alert("Dirección copiada"); } catch {}
  }
  async function save() {
    setSaving(true);
    try {
      await callAdminFn(upd, { id, shipping_status: shippingStatus as "pendiente"|"empacado"|"enviado"|"entregado"|"cancelado", carrier: carrier as "Estafeta"|"DHL"|"FedEx"|"Otro", tracking_number: tracking, admin_notes: adminNotes });
      await qc.invalidateQueries({ queryKey: ["admin","order", id] });
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-5 print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <Link to="/admin/pedidos" className="text-sm text-muted-foreground hover:text-foreground">← Pedidos</Link>
        <Button variant="outline" onClick={() => window.print()}><Printer className="mr-1 h-4 w-4" />Imprimir</Button>
      </div>
      <h1 className="text-2xl font-extrabold">Pedido #{o.id.slice(0,8)}</h1>
      <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString("es-MX")} · Estado pago: <strong>{o.status}</strong> · MP: {o.mp_payment_id ?? "—"}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between"><h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Dirección de envío</h2>
            <Button size="sm" variant="outline" onClick={copyAddress}><Copy className="mr-1 h-3 w-3"/>Copiar</Button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap text-sm font-mono">{fullAddress}</pre>
          {a.rfc && <p className="mt-2 text-xs">RFC: {a.rfc}</p>}
        </section>
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Items</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.items.map((it) => (
              <li key={it.id} className="flex justify-between gap-2 border-b border-border pb-2">
                <span>{it.product_name} {it.dose} · {it.qty} viales</span>
                <span className="tabular-nums">{formatMxn(it.line_total_mxn)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between text-base font-extrabold"><span>Total</span><span className="tabular-nums">{formatMxn(o.total_mxn)}</span></div>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-5 print:hidden">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Envío</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Estado<br/>
            <select value={shippingStatus} onChange={(e)=>setShippingStatus(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2">
              {["pendiente","empacado","enviado","entregado","cancelado"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-sm">Paquetería<br/>
            <select value={carrier} onChange={(e)=>setCarrier(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2">
              {["Estafeta","DHL","FedEx","Otro"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">Número de guía<br/>
            <Input value={tracking} onChange={(e)=>setTracking(e.target.value)} className="mt-1" />
          </label>
          <label className="text-sm sm:col-span-2">Notas internas<br/>
            <Textarea value={adminNotes} onChange={(e)=>setAdminNotes(e.target.value)} rows={2} className="mt-1" />
          </label>
        </div>
        <Button className="mt-3" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</Button>
      </section>

      {o.notes && <section className="rounded-xl border border-border bg-yellow-50 p-4 text-sm"><strong>Notas del cliente:</strong> {o.notes}</section>}

      <section className="rounded-xl border border-border bg-card p-5 print:hidden">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Historial</h2>
        <ul className="mt-3 space-y-1 text-xs">
          {data.events.map((e) => (
            <li key={e.id}><span className="text-muted-foreground">{new Date(e.created_at).toLocaleString("es-MX")}</span> · <strong>{e.event}</strong></li>
          ))}
        </ul>
      </section>
    </div>
  );
}