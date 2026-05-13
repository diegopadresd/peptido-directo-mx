import { PACKS, packTotal, formatMxn } from "@/lib/pricing";

export function PricingTiers({ basePricePerVial, productName }: { basePricePerVial: number; productName: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <table className="w-full text-left">
        <thead className="bg-muted">
          <tr>
            <th className="px-5 py-4 text-sm font-semibold">Pack</th>
            <th className="px-5 py-4 text-right text-sm font-semibold">Precio por vial</th>
            <th className="px-5 py-4 text-right text-sm font-semibold">Total</th>
            <th className="px-5 py-4 text-right text-sm font-semibold">Ahorro</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {PACKS.map((p) => {
            const total = packTotal(basePricePerVial, p.qty);
            const perVial = Math.round(total / p.qty);
            return (
              <tr key={p.qty}>
                <td className="px-5 py-4 text-sm font-semibold">{p.qty} viales</td>
                <td className="px-5 py-4 text-right tabular text-base font-bold text-foreground">{formatMxn(perVial)}</td>
                <td className="px-5 py-4 text-right tabular text-sm text-muted-foreground">{formatMxn(total)}</td>
                <td className="px-5 py-4 text-right tabular text-sm font-semibold text-primary">
                  {p.savingsPct > 0 ? `-${p.savingsPct}%` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-accent/40 px-5 py-3 text-xs text-muted-foreground">
        Cada pedido es de un solo compuesto. Para combinar péptidos distintos, contáctanos por WhatsApp.
      </div>
    </div>
  );
}
