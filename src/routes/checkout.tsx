import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2, CreditCard } from "lucide-react";
import { useCart } from "@/lib/cart/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMxn } from "@/lib/pricing";
import { MX_STATES } from "@/lib/mx-states";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · Péptidos Mayoreo" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

const Schema = z.object({
  customerName: z.string().min(2, "Nombre requerido").max(120),
  customerEmail: z.string().email("Email inválido").max(180),
  customerPhone: z.string().min(10, "Mín. 10 dígitos").max(20),
  street: z.string().min(2).max(180),
  extNumber: z.string().min(1).max(30),
  intNumber: z.string().max(30).optional(),
  neighborhood: z.string().min(2).max(120),
  postalCode: z.string().regex(/^\d{5}$/, "CP de 5 dígitos"),
  city: z.string().min(2).max(120),
  state: z.string().min(2),
  references: z.string().max(300).optional(),
  rfc: z.string().max(13).optional(),
  notes: z.string().max(500).optional(),
});

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const cartToken = useCart((s) => s.cartToken);
  const subtotal = items.reduce((a, x) => a + x.lineTotal, 0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Button asChild className="mt-4 rounded-full">
          <Link to="/productos">Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData) as Record<string, string>;
    const parsed = Schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, items, cartToken }),
      });
      const data = await res.json() as { init_point?: string; error?: string; order_id?: string };
      if (!res.ok || !data.init_point) throw new Error(data.error || "No se pudo crear el pedido");
      window.location.href = data.init_point;
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">Completa tus datos. La guía de envío se imprimirá con esta dirección.</p>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 md:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Section title="Contacto">
            <Field label="Nombre completo" name="customerName" error={errors.customerName} />
            <Field label="Email" name="customerEmail" type="email" error={errors.customerEmail} />
            <Field label="WhatsApp / teléfono" name="customerPhone" type="tel" error={errors.customerPhone} placeholder="10 dígitos" />
          </Section>
          <Section title="Dirección de envío">
            <Field label="Calle" name="street" error={errors.street} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Núm. exterior" name="extNumber" error={errors.extNumber} />
              <Field label="Núm. interior (opcional)" name="intNumber" />
            </div>
            <Field label="Colonia" name="neighborhood" error={errors.neighborhood} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Código postal" name="postalCode" error={errors.postalCode} placeholder="00000" />
              <Field label="Ciudad / municipio" name="city" error={errors.city} />
            </div>
            <div>
              <Label className="text-sm">Estado</Label>
              <Select name="state" defaultValue="Sonora">
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MX_STATES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
              {errors.state && <p className="mt-1 text-xs text-destructive">{errors.state}</p>}
            </div>
            <div>
              <Label className="text-sm">Referencias del domicilio (opcional)</Label>
              <Textarea name="references" rows={2} placeholder="Color de la fachada, entre qué calles, etc." className="mt-1" />
            </div>
            <Field label="RFC (opcional, para factura)" name="rfc" placeholder="XAXX010101000" />
          </Section>
          <Section title="Notas adicionales">
            <Textarea name="notes" rows={3} placeholder="Instrucciones especiales para tu pedido…" />
          </Section>
        </div>
        <aside className="h-fit rounded-xl border border-border bg-card p-5 sticky top-20 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Resumen</h2>
          <ul className="space-y-2 text-sm">
            {items.map((it) => (
              <li key={it.productSlug + it.dose} className="flex justify-between gap-2">
                <span className="min-w-0 truncate">{it.productName} {it.dose} · {it.qty}v</span>
                <span className="tabular-nums shrink-0">{formatMxn(it.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{formatMxn(subtotal)}</span></div>
            <div className="flex justify-between text-muted-foreground text-sm"><span>Envío</span><span>Por confirmar</span></div>
            <div className="mt-2 flex justify-between text-lg font-extrabold"><span>Total</span><span className="tabular-nums">{formatMxn(subtotal)}</span></div>
          </div>
          {serverError && <p className="text-xs text-destructive">{serverError}</p>}
          <Button type="submit" disabled={loading} size="lg" className="w-full rounded-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Procesando…</> : <><CreditCard className="mr-2 h-4 w-4"/>Pagar con Mercado Pago</>}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">Confirmamos guía y costo de envío después del pago.</p>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-border bg-card p-5 space-y-3">
      <legend className="px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, name, type = "text", error, placeholder }: { label: string; name: string; type?: string; error?: string; placeholder?: string }) {
  return (
    <div>
      <Label htmlFor={name} className="text-sm">{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} className="mt-1" />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}