import { create } from "zustand";
import { persist } from "zustand/middleware";
import { syncCart } from "@/lib/analytics/track";
import { trackCart } from "@/lib/crm";
import { trackCartUpdate } from "@/lib/crm-tracker";

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
  if (typeof window === "undefined") return "";
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
          let next: CartItem[];
          if (i >= 0) {
            next = [...s.items];
            next[i] = item;
          } else {
            next = [...s.items, item];
          }
          queueCartSync(s.cartToken, next);
          return { items: next };
        }),
      updateQty: (slug, dose, qty) =>
        set((s) => {
          const items = s.items.map((x) =>
            x.productSlug === slug && x.dose === dose
              ? { ...x, qty, lineTotal: Math.round((x.unitPrice * qty * x.lineTotal) / (x.unitPrice * x.qty || 1)) }
              : x,
          );
          queueCartSync(s.cartToken, items);
          return { items };
        }),
      removeItem: (slug, dose) =>
        set((s) => {
          const items = s.items.filter((x) => !(x.productSlug === slug && x.dose === dose));
          queueCartSync(s.cartToken, items);
          return { items };
        }),
      clear: () => set((s) => { queueCartSync(s.cartToken, []); return { items: [] }; }),
      subtotal: () => get().items.reduce((acc, x) => acc + x.lineTotal, 0),
      count: () => get().items.reduce((acc, x) => acc + x.qty, 0),
    }),
    { name: "pm-cart-v1" },
  ),
);

let syncTimer: ReturnType<typeof setTimeout> | null = null;
function queueCartSync(cartToken: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  const subtotal = items.reduce((a, x) => a + x.lineTotal, 0);
  const itemCount = items.reduce((a, x) => a + x.qty, 0);
  trackCart({
    items: items as unknown as Array<Record<string, unknown>>,
    item_count: itemCount,
    value_cents: Math.round(subtotal * 100),
    currency: "MXN",
  });
  trackCartUpdate({
    items: items.map((x) => ({ sku: x.productSlug + ":" + x.dose, name: `${x.productName} ${x.dose}`, qty: x.qty, price_cents: Math.round((x.lineTotal / Math.max(x.qty, 1)) * 100) })),
    value_cents: Math.round(subtotal * 100),
    currency: "MXN",
  });
  syncTimer = setTimeout(() => {
    syncCart({ cartToken, items: items as unknown as Array<Record<string, unknown>>, subtotalMxn: subtotal });
  }, 600);
}

let initialSyncDone = false;
export function ensureCartPersisted() {
  if (typeof window === "undefined" || initialSyncDone) return;
  initialSyncDone = true;
  const s = useCart.getState();
  if (!s.cartToken || s.items.length === 0) return;
  const subtotal = s.items.reduce((a, x) => a + x.lineTotal, 0);
  syncCart({
    cartToken: s.cartToken,
    items: s.items as unknown as Array<Record<string, unknown>>,
    subtotalMxn: subtotal,
  });
}

export function syncCartWithCustomer(input: { email?: string; customerName?: string; phone?: string }) {
  const state = useCart.getState();
  const subtotal = state.items.reduce((a, x) => a + x.lineTotal, 0);
  trackCart({
    items: state.items as unknown as Array<Record<string, unknown>>,
    item_count: state.items.reduce((a, x) => a + x.qty, 0),
    value_cents: Math.round(subtotal * 100),
    currency: "MXN",
    user_email: input.email,
  });
  trackCartUpdate({
    items: state.items.map((x) => ({ sku: x.productSlug + ":" + x.dose, name: `${x.productName} ${x.dose}`, qty: x.qty, price_cents: Math.round((x.lineTotal / Math.max(x.qty, 1)) * 100) })),
    value_cents: Math.round(subtotal * 100),
    currency: "MXN",
    user_email: input.email,
  });
  return syncCart({
    cartToken: state.cartToken,
    items: state.items as unknown as Array<Record<string, unknown>>,
    subtotalMxn: subtotal,
    email: input.email,
    customerName: input.customerName,
    phone: input.phone,
  });
}