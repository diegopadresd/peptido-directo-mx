export type Pack = {
  qty: number;
  multiplier: number;
  label: string;
  badge?: string;
  savingsPct: number;
};

// Reglas de pricing por pack acordadas:
// 10 viales = base × 10  (sin descuento, MOQ)
// 20 viales = base × 18  (≈ 10% off vs precio base por vial)
// 30 viales = base × 25  (≈ 17% off vs precio base por vial)
export const PACKS: Pack[] = [
  { qty: 10, multiplier: 10, label: "Pack x10", savingsPct: 0 },
  { qty: 20, multiplier: 18, label: "Pack x20", badge: "Ahorra 10%", savingsPct: 10 },
  { qty: 30, multiplier: 25, label: "Pack x30", badge: "Más popular · Ahorra 17%", savingsPct: 17 },
];

export const packTotal = (basePricePerVial: number, qty: number) => {
  const pack = PACKS.find((p) => p.qty === qty);
  if (pack) return basePricePerVial * pack.multiplier;
  // mezcla libre: aplica el descuento del pack más alto que cubra `qty`
  const tier = [...PACKS].reverse().find((p) => qty >= p.qty) ?? PACKS[0];
  const effectivePerVial = (basePricePerVial * tier.multiplier) / tier.qty;
  return Math.round(effectivePerVial * qty);
};

export const effectivePerVial = (basePricePerVial: number, qty: number) =>
  Math.round(packTotal(basePricePerVial, qty) / qty);

export const formatMxn = (n: number) =>
  `$${n.toLocaleString("es-MX")} MXN`;
