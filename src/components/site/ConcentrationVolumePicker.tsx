import { useState, useMemo } from "react";
import { CreditCard, MessageCircle, Loader2, ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/data/products";
import { PACKS, packTotal, formatMxn } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart/store";
import { trackEvent } from "@/lib/analytics/track";

function VialDots({ count }: { count: number }) {
  // Show up to 30 dots in a wrapping row
  const dots = Math.min(count, 30);
  return (
    <div className="mt-3 flex flex-wrap gap-[3px]">
      {Array.from({ length: dots }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden />
      ))}
    </div>
  );
}

export function ConcentrationVolumePicker({ product }: { product: Product }) {
  const [doseIdx, setDoseIdx] = useState(0);
  const [qty, setQty] = useState<number>(20);
  const variant = product.variants[doseIdx];

  const total = useMemo(() => packTotal(variant.basePricePerVial, qty), [variant, qty]);
  const perVial = Math.round(total / qty);

  const wa = buildWaLink(
    `Hola, quiero comprar ${product.name} ${variant.dose} — pack de ${qty} viales (${formatMxn(total)}). ¿Confirmamos disponibilidad y pago por eCartPay?`,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCart((s) => s.addItem);
  const cartToken = useCart((s) => s.cartToken);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem({
      productSlug: product.slug,
      productName: product.name,
      dose: variant.dose,
      qty,
      unitPrice: variant.basePricePerVial,
      lineTotal: total,
    });
    trackEvent("add_to_cart", { productSlug: product.slug, valueMxn: total, meta: { dose: variant.dose, qty } });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  async function handlePay() {
    setLoading(true);
    setError(null);
    trackEvent("quick_pay_click", { productSlug: product.slug, valueMxn: total, meta: { dose: variant.dose, qty } });
    try {
      // Add product to cart and route through full checkout so we capture
      // shipping data, create an internal order, and the admin sees the pedido.
      addItem({
        productSlug: product.slug,
        productName: product.name,
        dose: variant.dose,
        qty,
        unitPrice: variant.basePricePerVial,
        lineTotal: total,
      });
      window.location.href = "/checkout";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      {/* CONCENTRACIÓN */}
      {product.variants.length > 1 && (
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Concentración por vial
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v, i) => (
              <button
                key={v.dose}
                onClick={() => setDoseIdx(i)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${
                  i === doseIdx
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {v.dose}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SELECCIÓN DE VOLUMEN */}
      <div>
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Selección de volumen
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {PACKS.map((p) => {
            const t = packTotal(variant.basePricePerVial, p.qty);
            const pv = Math.round(t / p.qty);
            const selected = qty === p.qty;
            const popular = p.qty === 20;
            return (
              <button
                key={p.qty}
                onClick={() => setQty(p.qty)}
                className={`relative rounded-xl border-2 p-4 text-left transition ${
                  selected
                    ? "border-primary bg-accent/40 shadow-card"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Más popular
                  </span>
                )}
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {p.qty} viales
                </p>
                <p className="mt-1 tabular text-lg font-extrabold text-foreground">{formatMxn(t)}</p>
                <p className="text-[11px] text-muted-foreground">{formatMxn(pv)} / vial</p>
                {p.savingsPct > 0 && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    Ahorra {p.savingsPct}%
                  </span>
                )}
                <VialDots count={p.qty} />
              </button>
            );
          })}
        </div>
      </div>

      {/* TOTAL */}
      <div className="rounded-2xl border border-border bg-muted/40 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Total del pedido</span>
          <span className="tabular text-3xl font-extrabold text-foreground">{formatMxn(total)}</span>
        </div>
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {formatMxn(perVial)} por vial · {qty} viales · {variant.dose}
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        <Button
          size="lg"
          onClick={handleAddToCart}
          variant="default"
          className="h-12 w-full rounded-full bg-primary text-primary-foreground shadow-card hover:bg-primary/90"
        >
          {added ? (
            <>
              <Check className="mr-1.5 h-4 w-4" /> Agregado al carrito
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1.5 h-4 w-4" /> Agregar al carrito
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handlePay}
          disabled={loading}
          className="h-12 w-full rounded-full border-2"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Redirigiendo a eCartPay…
            </>
          ) : (
            <>
              <CreditCard className="mr-1.5 h-4 w-4" /> Pagar este producto ahora
            </>
          )}
        </Button>
        {error && (
          <p className="text-center text-xs text-destructive">{error}</p>
        )}
        <Button asChild variant="ghost" className="h-11 w-full rounded-full text-foreground hover:bg-accent">
          <a href={wa} target="_blank" rel="noopener">
            <MessageCircle className="mr-1.5 h-4 w-4" /> Solicitar por WhatsApp
          </a>
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Pago seguro con eCartPay · envío 3-7 días hábiles
        </p>
      </div>
    </div>
  );
}
