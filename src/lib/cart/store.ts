import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productSlug: string;
  productName: string;
  dose: string;
  qty: number;
  unitPrice: number; // mxn
  lineTotal: number; // mxn
};

type CartState = {
  items: CartItem[];
  cartToken: string;
  addItem: (item: CartItem) => void;
  updateQty: (slug: string, dose: string, qty: number) => void;
  removeItem: (slug: string, dose: string) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

function makeToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartToken: makeToken(),
      addItem: (item) =>
        set((s) => {
          const i = s.items.findIndex((x) => x.productSlug === item.productSlug && x.dose === item.dose);
          if (i >= 0) {
            const next = [...s.items];
            next[i] = item;
            return { items: next };
          }
          return { items: [...s.items, item] };
        }),
      updateQty: (slug, dose, qty) =>
        set((s) => ({
          items: s.items.map((x) =>
            x.productSlug === slug && x.dose === dose
              ? { ...x, qty, lineTotal: Math.round((x.unitPrice * qty * x.lineTotal) / (x.unitPrice * x.qty || 1)) }
              : x,
          ),
        })),
      removeItem: (slug, dose) =>
        set((s) => ({ items: s.items.filter((x) => !(x.productSlug === slug && x.dose === dose)) })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((acc, x) => acc + x.lineTotal, 0),
      count: () => get().items.reduce((acc, x) => acc + x.qty, 0),
    }),
    { name: "pm-cart-v1" },
  ),
);