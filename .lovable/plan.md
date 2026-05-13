
## Objetivo

Reemplazar el catálogo demo con la lista real (32 productos / ~45 SKU por dosis), una página por producto con selector de dosis, carrito de mezcla libre (mínimo 10 viales) y pago con Mercado Pago Checkout Pro.

---

## 1. Modelo de datos

`src/data/products.ts` — reescrito. Cada producto:

```ts
type DoseVariant = { dose: string; mg: number; basePricePerVial: number };
type Product = {
  slug; name; category; shortDesc; longDesc; mechanism; dosing; storage;
  image; variants: DoseVariant[];   // 1..n dosis
  faqs; related; bestSeller?; keywords;
};
```

Categorías (slug → nombre):
- `recuperacion` — Recuperación y reparación
- `gh-muscular` — Crecimiento muscular / GH
- `perdida-peso` — Pérdida de peso (GLP-1/GIP)
- `cognicion` — Cognición y nootrópicos
- `longevidad` — Anti-aging y longevidad
- `bronceado` — Bronceado y pigmentación
- `intimo-hormonal` — Bienestar íntimo y hormonal *(evita "sexual")*

32 productos con sus variantes desde el PDF (BPC-157, TB-500, Wolverine, CJC-1295, CJC+Ipa, Ipamorelin, Tesamorelin, HGH Frag, IGF-1 LR3, Sermorelin, Hexarelin, Semaglutida, Tirzepatida, Retatrutida, Cagrilintide, MOTS-c, 5-Amino-1MQ, AOD-9604, Mazdutide, Semax, Selank, Cerebrolysin, Dihexa, DSIP, GHK-Cu, Epithalon, NAD+, Glutathione, Thymosin α-1, Melanotan I/II, PT-141, Kisspeptin-10, Oxytocin, HMG).

Copy de mecanismo / dosis / almacenamiento adaptado del estilo de brutalrx (research-only, técnico, breve), sin copiar literal.

## 2. Pricing por pack (regla nueva)

Helper en `src/lib/pricing.ts`:

```ts
export const PACKS = [
  { qty: 10, multiplier: 10, label: "Pack x10" },
  { qty: 20, multiplier: 18, label: "Pack x20", badge: "Ahorra 10%" },
  { qty: 30, multiplier: 25, label: "Pack x30", badge: "Más popular · Ahorra 17%" },
];
export const packPrice = (base, qty) => base * PACKS.find(p=>p.qty===qty).multiplier;
```

- Catálogo y cards muestran **"desde $X MXN / vial"** (precio base mayoreo).
- PDP muestra los 3 packs con precio total y precio efectivo por vial.
- Carrito permite mezcla libre con MOQ global de 10 viales (validación cliente + servidor); precio = `base × multiplicador del pack más cercano según cantidad total del SKU`. *(Para mezcla libre con varios SKUs, el descuento se aplica por línea según su propia cantidad; documentado en checkout.)*

## 3. Páginas / rutas

Reescritura del catálogo + PDP, resto se mantiene.

```text
src/routes/
  index.tsx                    — actualizar best sellers (Tirzepatida, Retatrutida, Semaglutida, BPC-157, CJC+Ipa, Wolverine)
  productos.tsx                — grid filtrable por las 7 categorías; muestra "desde $X/vial"
  productos.$slug.tsx          — PDP con <DoseSelector/> + <PackSelector/> + <AddToCartButton/>
  carrito.tsx                  — NUEVO: lista de items, validación MOQ≥10, total, botón "Pagar con Mercado Pago"
  pago.exito.tsx               — NUEVO: confirmación post-checkout (lee ?payment_id)
  pago.error.tsx               — NUEVO
  pago.pendiente.tsx           — NUEVO
  api/public/mercadopago.webhook.ts — NUEVO: server route, valida x-signature de MP, marca pedido como pagado
  sitemap[.]xml.tsx            — incluir todas las nuevas slugs
```

`src/lib/cart.ts` — store de carrito con `localStorage` (zustand-lite o useSyncExternalStore manual), items `{productSlug, dose, qty}`.

`src/components/site/`:
- `DoseSelector.tsx` — pills con las dosis disponibles
- `PackSelector.tsx` — 3 cards (10/20/30) con precio total + badge ahorro
- `AddToCartButton.tsx`
- `CartDrawer.tsx` + `CartIcon.tsx` (header)
- `MercadoPagoButton.tsx`

## 4. Integración Mercado Pago

Requiere **Lovable Cloud** (lo activamos al inicio) y un secret `MERCADOPAGO_ACCESS_TOKEN` (sandbox primero).

Flujo Checkout Pro (redirect, sin SDK del lado cliente — más simple y robusto en Workers):

1. **Server function** `createMpPreference` (`src/lib/mercadopago.functions.ts`):
   - Recibe `{ items: [{slug, dose, qty}] }`.
   - Recalcula precios server-side (nunca confía en el cliente).
   - Valida MOQ ≥ 10.
   - Inserta `orders` (status `pending`) y `order_items` en DB.
   - POST a `https://api.mercadopago.com/checkout/preferences` con items, `external_reference = order.id`, `back_urls` (/pago/exito, /pago/error, /pago/pendiente), `notification_url = /api/public/mercadopago-webhook`, `auto_return: approved`.
   - Devuelve `init_point` (live) o `sandbox_init_point`.

2. **Cliente** redirige a `init_point`.

3. **Webhook** `/api/public/mercadopago-webhook`:
   - Verifica header `x-signature` HMAC con `MERCADOPAGO_WEBHOOK_SECRET`.
   - Para topic `payment`: GET `https://api.mercadopago.com/v1/payments/{id}` → actualiza order por `external_reference`.
   - Estados: `approved` → `paid`, `rejected` → `failed`, etc.

**Tablas Supabase** (migración):
- `orders(id uuid pk, created_at, status text, total_mxn int, customer_name, customer_email, customer_phone, customer_address jsonb, mp_preference_id, mp_payment_id, external_reference uuid)`
- `order_items(id, order_id fk, product_slug, dose, qty, unit_price_mxn, line_total_mxn)`
- RLS: insert público vía server fn (service role bypass); select restringido (no exponer).

Página de **checkout previo** (`/carrito` paso 2) recoge nombre, email, WhatsApp y dirección de envío antes de crear preferencia.

## 5. SEO

- `head()` por PDP: `title = "<Nombre> Mayoreo México - Desde $X/vial | Péptidos Mayoreo"`, description con dosis disponibles.
- JSON-LD `Product` con `AggregateOffer` (lowPrice = base, highPrice = base×25, offerCount = 3 packs × n dosis).
- Sitemap regenerado con las ~32 nuevas slugs.
- Breadcrumbs en cada PDP.
- Canonicals correctos (una URL por producto, dosis vía query no indexable o todas en la misma página → ya cubierto).

## 6. UX / componentes header

- Añadir ícono de carrito con contador (header).
- Banner sticky superior: "Pedido mínimo 10 viales · Pago seguro con Mercado Pago · Envío 15-25 días".
- WhatsApp FAB se mantiene como soporte secundario; el CTA primario en PDP/carrito ahora es **"Agregar al carrito"** + **"Pagar con Mercado Pago"**.

## 7. Aviso legal

Todas las páginas y JSON-LD mantienen el disclaimer **"For Research Use Only · No para uso humano"**, replicando el tono de brutalrx.

---

## Fuera de alcance (lo confirmamos después)

- Cuentas de usuario / historial de pedidos (los pedidos quedan ligados solo a email).
- Cálculo automático de envío (se cobra envío fijo o gratis según monto, ya configurable como constante).
- Producción real de MP: arrancamos en **sandbox**; pasar a producción solo cambia el access token.

## Orden de implementación

1. Activar Lovable Cloud + crear migración `orders` / `order_items`.
2. Reescribir `products.ts` con los 32 productos del PDF + `pricing.ts`.
3. Refactor `productos.tsx` + `productos.$slug.tsx` con DoseSelector / PackSelector.
4. Carrito (store + drawer + página `/carrito` con form de envío).
5. Server fn `createMpPreference` + página de éxito/error/pendiente.
6. Webhook MP + verificación de firma.
7. Pedir secret `MERCADOPAGO_ACCESS_TOKEN` (y `MERCADOPAGO_WEBHOOK_SECRET`).
8. Actualizar header (carrito), home (best sellers reales), sitemap.
9. QA: build + invocar server fn en sandbox.
