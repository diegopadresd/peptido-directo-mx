import { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import { PACKS, packTotal, formatMxn } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/whatsapp";

export function PackPicker({ product }: { product: Product }) {
  const [doseIdx, setDoseIdx] = useState(0);
  const [qty, setQty] = useState<number>(20);
  const variant = product.variants[doseIdx];
  const total = packTotal(variant.basePricePerVial, qty);
  const perVial = Math.round(total / qty);

  const wa = buildWaLink(
    `Hola, quiero comprar ${product.name} ${variant.dose} — pack de ${qty} viales (${formatMxn(total)}). ¿Confirmamos disponibilidad y pago por Mercado Pago?`,
  );

  return (
    <div className="space-y-6">
      {product.variants.length > 1 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dosis por vial</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v, i) => (
              <button
                key={v.dose}
                onClick={() => setDoseIdx(i)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
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

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Elige tu pack</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {PACKS.map((p) => {
            const t = packTotal(variant.basePricePerVial, p.qty);
            const pv = Math.round(t / p.qty);
            const selected = qty === p.qty;
            const popular = p.qty === 20;
            return (
              <button
                key={p.qty}
                onClick={() => setQty(p.qty)}
                className={`relative rounded-2xl border-2 p-4 text-left transition ${
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
                <p className="font-display text-2xl font-extrabold tracking-tight">{p.qty}</p>
                <p className="text-xs text-muted-foreground">viales</p>
                <p className="mt-3 tabular text-base font-bold text-foreground">{formatMxn(pv)}</p>
                <p className="text-[11px] text-muted-foreground">por vial</p>
                {p.savingsPct > 0 && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    Ahorra {p.savingsPct}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Total del pedido</span>
          <span className="tabular text-3xl font-extrabold text-foreground">{formatMxn(total)}</span>
        </div>
        <p className="mt-1 text-right text-xs text-muted-foreground">{formatMxn(perVial)} por vial · {qty} viales</p>
      </div>

      <div className="flex flex-col gap-2">
        <Button asChild size="lg" className="h-12 w-full rounded-full bg-primary text-primary-foreground shadow-card hover:bg-primary/90">
          <a href={wa} target="_blank" rel="noopener">
            Comprar ahora <ArrowRight className="ml-1.5 h-4 w-4" />
          </a>
        </Button>
        <Button asChild variant="ghost" className="h-11 w-full rounded-full text-foreground hover:bg-accent">
          <a href={wa} target="_blank" rel="noopener">
            <MessageCircle className="mr-1.5 h-4 w-4" /> Preguntar por WhatsApp
          </a>
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Pedido de 1 solo compuesto · pago por Mercado Pago · envío 10-20 días
        </p>
      </div>
    </div>
  );
}
