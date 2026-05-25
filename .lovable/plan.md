# Plan: migrar de Mercado Pago a ecartpay

## 1. Secrets que te pediré
Después de aprobar el plan abriré el formulario seguro para guardar:
- `ECARTPAY_PUBLIC_KEY`
- `ECARTPAY_SECRET_KEY`
- `ECARTPAY_WEBHOOK_SECRET` (para verificar la firma del webhook)

> Nota: ecartpay no es un proveedor oficial conocido por Lovable. Implementaré la integración asumiendo el patrón REST estándar (POST a `/checkout/sessions` con Bearer token, redirect a `init_point`, webhook firmado con HMAC-SHA256 en header `x-ecartpay-signature`). En cuanto me pases el link a su doc oficial ajusto endpoints/headers exactos sin re-planear.

## 2. Cambios de código

### Nueva ruta server: `src/routes/api.checkout.create-order.ts`
Reescribo la ruta actual para que:
- Valide el body con el mismo Zod schema.
- Cree el `order` en DB (igual que hoy).
- Llame al endpoint hosted de ecartpay con `ECARTPAY_SECRET_KEY`.
- Guarde `external_reference = order.id` y el `session_id` de ecartpay en una nueva columna.
- Devuelva `{ init_point, order_id }` (la página de checkout no cambia).

### Nueva ruta webhook: `src/routes/api.public.ecartpay-webhook.ts`
- Verifica firma HMAC con `ECARTPAY_WEBHOOK_SECRET` (timing-safe).
- Actualiza `orders.status` a `approved` / `rejected` / `pending` según evento.
- Inserta evento en `order_events`.
- Dispara el email de notificación (reutiliza `lib/email/notify.server.ts`).

### Eliminar / limpiar
- Borrar `src/routes/api.checkout.mercadopago.ts`.
- Borrar `src/routes/api.public.mercadopago-webhook.ts`.
- En `supabase/config.toml`, quitar el bloque de la función MP si existe.
- En `src/components/site/ConcentrationVolumePicker.tsx` y `CartDrawer.tsx`: cambiar copy "Mercado Pago" → "ecartpay" (botones, leyendas de seguridad).
- En `src/routes/checkout.tsx`: cambiar texto del botón final ("Pagar con ecartpay").
- En `src/routes/pago.exito.tsx` / `pago.fallo.tsx` / `pago.pendiente.tsx`: ya leen `?ref=`, solo ajustar copy "Mercado Pago" → "ecartpay".
- Dejar el secret `MERCADOPAGO_ACCESS_TOKEN` en Lovable Cloud (no se puede borrar desde aquí; te indico cómo eliminarlo manualmente si quieres).

## 3. Cambio de DB (migración)
Agregar a `orders`:
- `ecartpay_session_id TEXT`
- `ecartpay_payment_id TEXT`
- `ecartpay_status_detail TEXT`

(Las columnas `mp_*` las dejo para no romper pedidos históricos; quedan como nullable y se ignoran.)

## 4. URL del webhook que tendrás que pegar en el panel de ecartpay
`https://peptidosmayoreo.com/api/public/ecartpay-webhook`
(o el dominio publicado actual `https://peptido-directo-mx.lovable.app/api/public/ecartpay-webhook` si aún no apuntas el dominio).

## 5. Verificación post-deploy
1. Hacer un pedido de prueba → ver que redirija a ecartpay.
2. Pagar con tarjeta de prueba → ver redirect a `/pago/exito`.
3. Revisar logs del webhook → `orders.status='approved'` y `order_events` con el evento.
4. Confirmar que llega el email a `ADMIN_NOTIFICATION_EMAIL`.

Si apruebas, al pasar a build mode: primero ejecuto la migración, después te pido los 3 secrets, y al recibirlos escribo el código.