## Replicar el checkout de Peptide MX (handoff a Zelara → check-out.mx)

Peptide MX **no** integra eCartPay ni Mercado Pago directamente. Hace un POST a un edge function de Zelara (`create-checkout-handoff`), Zelara crea la orden, genera un token, y devuelve un `init_point` a `https://check-out.mx/c/<token>`. El cliente es redirigido ahí, paga, y vuelve al `return_url` en peptidosmayoreo. Las órdenes pagadas viven en la DB de Zelara, etiquetadas con `source`.

### Flujo exacto a implementar

```text
[checkout peptidosmayoreo]
        │
        ▼
POST /api/checkout/create-order (server fn nuestro)
        │  arma payload tipo Peptide MX
        ▼
POST https://uizhzrudwujhjwhwjzfm.supabase.co/functions/v1/create-checkout-handoff
     headers: apikey + Authorization Bearer (anon key de Zelara, ya pública)
     body: { source, email, items[], subtotal, shipping_cost, total,
             shipping_address, return_url, discount_code? }
        │
        ▼  { init_point: "https://check-out.mx/c/<token>", order_id }
        │
[redirección del navegador a init_point]
        │
        ▼ pago en check-out.mx (procesa con razón social neutral)
        │
        ▼ redirige a return_url = https://peptidosmayoreo.com/pago/exito?order_id=...
```

### Cambios concretos

**1. `src/routes/api.checkout.create-order.ts` — reescribir**
- Mantener el schema Zod actual de validación.
- Reemplazar toda la lógica de eCartPay/orden local por un único `fetch` al handoff de Zelara con el payload en el formato que espera (ver `items[].{id,title,quantity,unit_price,picture_url}`, `shipping_address` con `full_name/phone/email/street/exterior_number/interior_number/neighborhood/city/state/postal_code/country/notes`).
- `source`: ver pregunta abajo.
- `return_url`: `https://peptidosmayoreo.com/pago/exito?order_id=`
- Devolver al cliente `{ init_point, order_id }` para que el front haga `window.location.href = init_point`.

**2. Borrar archivos eCartPay**
- `src/lib/ecartpay.server.ts`
- `src/routes/api.public.ecartpay-webhook.ts`

**3. Borrar secrets sobrantes** (opcional, después de validar): `ECARTPAY_PUBLIC_KEY`, `ECARTPAY_SECRET_KEY`, `STRIPE_SECRET_KEY`.

**4. Frontend `src/routes/checkout.tsx`** — cambiar label del botón a "Pagar" (o "Continuar al pago seguro"). El resto del flujo (cart → submit → redirect a `init_point`) ya funciona; solo cambia el destino.

**5. Copys sitewide** — sustituir menciones de "eCartPay" → "Pago seguro" / "check-out.mx" / "Mercado Pago" (Peptide MX dice "Pago seguro procesado por Mercado Pago" porque check-out.mx usa MP por detrás). Archivos: `Footer.tsx`, `como-funciona.tsx`, `politica-devoluciones.tsx`, `productos.$slug.tsx`, `pago.*.tsx`, `index.tsx`, `blog.$slug.tsx`, `cities.ts`, etc.

**6. `src/routes/pago.exito.tsx`** — sin cambios funcionales (ya solo muestra mensaje + WhatsApp; no consulta webhook).

**7. Tabla `orders` de peptidosmayoreo**
- Decisión: con este flujo, las órdenes pagadas viven en la DB de Zelara. La tabla local `orders` deja de recibir registros nuevos.
- Implicación: el panel admin de peptidosmayoreo (`/admin/pedidos`, carritos, dashboard) deja de ver órdenes nuevas. Para verlas habría que entrar al admin de Zelara, filtrando por `source` correspondiente.

### Preguntas que necesito antes de codear

1. **`source` tag**: la función de Zelara solo reconoce `"peptide-mx"` o `"zelara"` por default. ¿Quieres que:
   - (a) usemos `"peptide-mx"` (las órdenes se mezclan con Peptide MX en el admin de Zelara), o
   - (b) agreguemos un valor nuevo tipo `"peptidos-mayoreo"` (requiere que actualices la función de Zelara también para reconocerlo), o
   - (c) `"zelara"` (todas mezcladas)?

2. **Panel admin local**: ¿Está bien que el admin de peptidosmayoreo deje de mostrar pedidos nuevos? (Como en Peptide MX, que no tiene admin de órdenes propio — todo se consulta en Zelara.)

3. **Catálogo de precios autoritativos en Zelara**: el handoff de Zelara tiene un mapa `CATALOG_PRICES_MXN` que sobrescribe precios para IDs conocidos. Los slugs de peptidosmayoreo (ej. `retatrutida-10mg`) coinciden parcialmente con ese catálogo pero **los packs** (precio por 5/10/25 viales) no encajan. ¿Te aseguras de actualizar ese catálogo en Zelara para que NO sobrescriba los precios de packs de peptidosmayoreo? O alternativa: usaremos un `id` distinto que no exista en el catálogo (p.ej. `pmm:retatrutida-10mg:5v`) para que Zelara respete el `unit_price` que mandamos.
