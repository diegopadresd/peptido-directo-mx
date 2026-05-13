import { useState } from "react";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart/store";
import { formatMxn } from "@/lib/pricing";

export function CartButton() {
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const count = items.reduce((a, x) => a + x.qty, 0);
  const subtotal = items.reduce((a, x) => a + x.lineTotal, 0);
  const removeItem = useCart((s) => s.removeItem);
  const clear = useCart((s) => s.clear);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label={`Carrito (${count})`}
          className="relative grid h-10 w-10 place-items-center rounded-md hover:bg-muted"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Tu carrito ({count} viales)</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.productSlug + item.dose} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-tight">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.dose} · pack {item.qty} viales</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productSlug, item.dose)}
                      className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                      aria-label="Eliminar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{formatMxn(Math.round(item.lineTotal / item.qty))} / vial</span>
                    <span className="font-bold tabular-nums">{formatMxn(item.lineTotal)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-xl font-extrabold tabular-nums">{formatMxn(subtotal)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Envío se cotiza en checkout según destino.</p>
            <Button asChild size="lg" className="w-full rounded-full" onClick={() => setOpen(false)}>
              <Link to="/checkout">Ir a checkout</Link>
            </Button>
            <button
              onClick={() => clear()}
              className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" /> Vaciar carrito
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}