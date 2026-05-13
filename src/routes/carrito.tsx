import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/store";
import { Button } from "@/components/ui/button";
import { formatMxn } from "@/lib/pricing";

export const Route = createFileRoute("/carrito")({
  head: () => ({ meta: [{ title: "Tu carrito · Péptidos Mayoreo" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const clear = useCart((s) => s.clear);
  const subtotal = items.reduce((a, x) => a + x.lineTotal, 0);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Tu carrito</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-10 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Tu carrito está vacío.</p>
          <Button asChild className="mt-5 rounded-full">
            <Link to="/productos">Ver catálogo</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.productSlug + item.dose} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold leading-tight">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">{item.dose} · pack {item.qty} viales</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productSlug, item.dose)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{formatMxn(Math.round(item.lineTotal / item.qty))} / vial</span>
                  <span className="text-lg font-extrabold tabular-nums">{formatMxn(item.lineTotal)}</span>
                </div>
              </li>
            ))}
            <button
              onClick={() => clear()}
              className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" /> Vaciar carrito
            </button>
          </ul>
          <aside className="h-fit rounded-xl border border-border bg-card p-5 sticky top-20">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Resumen</h2>
            <div className="mt-3 flex items-center justify-between">
              <span>Subtotal</span>
              <span className="text-2xl font-extrabold tabular-nums">{formatMxn(subtotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Envío se cotiza en checkout.</p>
            <Button asChild size="lg" className="mt-4 w-full rounded-full">
              <Link to="/checkout">Continuar a checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}