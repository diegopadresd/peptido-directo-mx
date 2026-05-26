
## Cambiar checkout de Stripe a eCartPay

Las llaves `ECARTPAY_PUBLIC_KEY` y `ECARTPAY_SECRET_KEY` ya están guardadas. Las columnas `ecartpay_session_id`, `ecartpay_payment_id`, `ecartpay_status_detail` ya existen en `orders`. La migración previa de eCartPay → Stripe se revierte así:

### Backend
1. **Crear `src/lib/ecartpay.server.ts`** — cliente con cache de JWT (1h), `createEcartpayOrder()` y `getEcartpayOrder()`. Mapea `paid`/`approved` → `approved`. Lee `ECARTPAY_ENV` (default `live`) para elegir endpoint sandbox vs producción.
2. **Reescribir `src/routes/api.checkout.create-order.ts`** — reemplazar la creación de Stripe Checkout Session por `createEcartpayOrder()`. Devolver `init_point` con el link de pago de eCart. Guardar `ecartpay_session_id` en lugar de reutilizar `mp_preference_id`.
3. **Crear `src/routes/api.public.ecartpay-webhook.ts`** — handler POST que (a) valida firma HMAC si `ECARTPAY_WEBHOOK_SECRET` existe, (b) re-consulta la orden a eCart como verificación autoritativa, (c) actualiza `orders.status`, registra `order_events`, dispara `notifyAdminNewOrder` una sola vez (idempotente vía `notified_at`).
4. **Eliminar archivos Stripe**: `src/lib/stripe.server.ts` y `src/routes/api.checkout.verify.ts`. (Dejo el secret `STRIPE_SECRET_KEY` en su lugar por si lo quieres conservar; dime si lo borro.)

### Frontend
5. **`src/routes/checkout.tsx`** — cambiar el label del botón de "Pagar con tarjeta" a "Pagar con eCartPay".
6. **`src/routes/pago.exito.tsx`** — quitar el `useEffect` que llamaba `/api/checkout/verify`; la confirmación llega por webhook. Mantener mensaje de WhatsApp genérico.
7. **Copys de marketing** — los textos sitewide ya dicen "Stripe". Los actualizo a "eCartPay" en el mismo pase (footer, FAQs, política, blog, ciudades, productos, home).

### Configuración pendiente de tu lado
- En el panel de eCart configurar el webhook a: `https://peptidosmayoreo.com/api/public/ecartpay-webhook`
- Si las llaves son sandbox, agregar el secret `ECARTPAY_ENV=sandbox`. Si son live no hace falta nada.
- Opcional más adelante: `ECARTPAY_WEBHOOK_SECRET` para validar firma del webhook.

### Pregunta
- ¿Las llaves que cargaste son **sandbox** o **live**? Necesito saberlo para apuntar al endpoint correcto (o configuro `ECARTPAY_ENV` después).
