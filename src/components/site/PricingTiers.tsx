import type { Tier } from "@/data/products";

export function PricingTiers({ tiers, productName }: { tiers: Tier[]; productName: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left">
        <thead className="bg-primary text-primary-foreground">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold">Cantidad</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Precio por vial</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Total estimado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {tiers.map((t) => {
            const label = t.max ? `${t.min}–${t.max} viales` : `${t.min}+ viales`;
            const total = t.pricePerVial * t.min;
            return (
              <tr key={t.min}>
                <td className="px-4 py-3 text-sm font-medium">{label}</td>
                <td className="px-4 py-3 text-right tabular text-base font-semibold text-primary">
                  ${t.pricePerVial.toLocaleString("es-MX")} MXN
                </td>
                <td className="px-4 py-3 text-right tabular text-sm text-muted-foreground">
                  desde ${total.toLocaleString("es-MX")} MXN
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-muted px-4 py-2 text-xs text-muted-foreground">
        Precios para {productName}. Compras de 100+ viales: cotización personalizada por WhatsApp.
      </div>
    </div>
  );
}
