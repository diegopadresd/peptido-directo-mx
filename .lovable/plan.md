
## 1. Backend (base de datos)

Migración con:

- **`carts`** — `id, email, customer_name, phone, items jsonb, subtotal_mxn, status (active|abandoned|converted), last_seen_at, created_at, updated_at, converted_order_id`. Marcado `abandoned` automáticamente si `last_seen_at < now() - interval '1 hour'` y status='active' (vía función + cron opcional, o se calcula al vuelo en queries).
- **`orders`** (ya existe) — agregar columnas: `cart_id`, `external_reference`, `mp_status_detail`, `shipping_status` (`pendiente|empacado|enviado|entregado|cancelado`), `tracking_number`, `carrier`, `shipped_at`, `admin_notes`. Ampliar `customer_address` jsonb con campos: `street, ext_number, int_number, neighborhood, city, state, postal_code, references, rfc?`.
- **`order_items`** (ya existe) — sin cambios.
- **`order_events`** — auditoría (`order_id, event, payload jsonb, created_at`) para historial visible en admin.
- **`profiles`** — `user_id, full_name, created_at`.
- **`user_roles`** + enum `app_role ('admin','user')` + función `has_role(uuid, app_role)` SECURITY DEFINER (patrón estándar, no en profiles).
- **RLS**: reescribir las políticas actuales `deny all` de `orders` y `order_items` para permitir `SELECT/UPDATE` solo a `has_role(auth.uid(),'admin')`. `carts` y `order_events` igual: solo admin lee. Inserts a `orders/order_items/carts` se hacen desde server functions con `supabaseAdmin` (RLS bypass).
- Trigger `handle_new_user` para crear `profiles` automáticamente.

## 2. Autenticación admin

- Habilitar email/password en Lovable Cloud (auto-confirm ON para que el primer admin entre sin verificar).
- Ruta `/login` (pública) — formulario email + password.
- Ruta `/admin` y subrutas bajo layout `_admin` con `beforeLoad` que: verifica sesión + verifica `has_role('admin')` vía RPC. Si no, redirect a `/`.
- Después de la migración entrego instrucciones para insertar manualmente el primer admin (`INSERT INTO user_roles (user_id, role) VALUES (...,'admin')`) usando el user_id que aparezca al registrarse.

## 3. Carrito (frontend)

- Store `useCart` con `zustand` + `persist` en localStorage. API: `addItem, removeItem, updateQty, clear, items, subtotal`.
- Cada item: `{ productSlug, productName, dose, qty, unitPrice, lineTotal }`.
- En `ConcentrationVolumePicker.tsx`: dos botones primarios — **"Agregar al carrito"** y **"Pagar este producto ahora"** (atajo, flujo actual). WhatsApp queda como secundario.
- Header: ícono carrito con badge de cantidad. Drawer lateral (`Sheet` shadcn) con items, subtotal, "Vaciar" y "Ir a checkout".
- Ruta `/carrito` con vista completa (mismo contenido que el drawer en formato página).

## 4. Checkout con datos de envío

- Ruta `/checkout` — formulario validado con `zod`:
  - Contacto: nombre, email, WhatsApp.
  - Envío: calle, núm. exterior, núm. interior (opcional), colonia, CP (5 dígitos), ciudad, estado (select 32 estados MX), referencias (textarea opcional), RFC (opcional).
  - Notas adicionales.
- Resumen de items + subtotal + envío (texto: "Cotizamos guía después" o monto fijo si decides; por ahora "Por confirmar").
- Botón "Pagar con Mercado Pago" → llama a nuevo endpoint **`POST /api/checkout/create-order`** que:
  1. Inserta `orders` (`status='pending'`, `mp_preference_id=null`) + `order_items` con `supabaseAdmin`.
  2. Marca el carrito (`carts.status='converted'`, `converted_order_id`).
  3. Crea preferencia en MP con `external_reference = order.id` y `back_urls`/`notification_url` actuales.
  4. Devuelve `init_point` + `order_id`.
- "Captura de carrito abandonado": al perder foco de email/cargar cualquier campo válido, fetch a **`POST /api/cart/track`** que upsert en `carts` (status='active', last_seen_at=now()). Idempotente por email + cart_token (cookie).

## 5. Webhook MP (mejorado)

`api.public.mercadopago-webhook.ts` ya hace lookup. Cambios:

- Buscar `orders` por `external_reference` (= order.id).
- Update: `status` (pending|approved|rejected|in_process), `mp_payment_id`, `mp_status_detail`, `total_mxn` real cobrado.
- Insertar fila en `order_events`.
- Si `status='approved'` y no se ha enviado correo aún (flag `notified_at`): llamar al server function `sendOrderNotification(order_id)`.

## 6. Notificación por correo (Lovable Emails)

- Si no hay dominio de envío configurado, primero abro el diálogo de configuración (`presentation-open-email-setup`).
- Una vez verificado el dominio: `setup_email_infra` + `scaffold_transactional_email`.
- Plantilla **"Nuevo pedido confirmado"** enviada a tu correo admin (configurado como secret `ADMIN_NOTIFICATION_EMAIL`) con: número de pedido, cliente (nombre/email/tel), dirección completa formateada lista para copiar a guía, items y total, link directo al pedido en `/admin/pedidos/:id`.
- Plantilla **"Confirmación de compra"** al cliente con resumen y siguiente paso.
- Encolado vía RPC `enqueue_email` (queue `transactional_emails`) — retry y rate-limit automáticos.

## 7. Panel /admin

Layout con sidebar. Páginas:

- **`/admin`** — dashboard: KPIs (ingresos hoy/7d/30d, pedidos por estado, conversión carrito→pedido, ticket promedio), gráfica simple de pedidos por día (últimos 30), top productos.
- **`/admin/pedidos`** — tabla con filtros (status pago, status envío, rango fechas, buscar por nombre/email/teléfono). Columnas: ID, fecha, cliente, total, pago, envío. Click → detalle.
- **`/admin/pedidos/:id`** — toda la info para imprimir guía: bloque de **dirección de envío** (botón "Copiar dirección formateada" listo para Estafeta/DHL/FedEx), items, totales, eventos MP, formulario para marcar como `empacado/enviado/entregado` + capturar `carrier` (select Estafeta/DHL/FedEx/Otro) y `tracking_number`. Botón "Imprimir resumen" (versión print-friendly del pedido).
- **`/admin/carritos-abandonados`** — tabla de `carts` con `status='abandoned'`: email, teléfono, items, subtotal, hace cuánto. Botón "Enviar WhatsApp" (link wa.me prellenado) y "Enviar correo recordatorio" (manual).
- **`/admin/clientes`** — agregado por email: nombre, total gastado, # pedidos, último pedido, dirección guardada. Click → historial de pedidos del cliente.
- **`/admin/configuracion`** — campo para cambiar `ADMIN_NOTIFICATION_EMAIL` (almacenado en una tabla `app_settings` single-row), toggle email cliente on/off.

Todas las queries vía `createServerFn` con `.middleware([requireSupabaseAuth])` + verificación `has_role(...,'admin')` dentro del handler usando `supabaseAdmin`.

## 8. Detalles técnicos

- Validación zod en cada endpoint server (`/api/checkout/create-order`, `/api/cart/track`, server fns admin).
- Server functions admin en `src/lib/admin.functions.ts` (solo `createServerFn` + imports, para no filtrar `client.server` al bundle).
- `useCart` consciente de SSR (lazy hydrate).
- Después de `mp_payment_id` aprobado, el carrito ya convertido se vacía en cliente al aterrizar en `/pago/exito` (mensaje + CTA "Volver al catálogo").
- Indices: `orders(created_at desc)`, `orders(status)`, `orders(customer_email)`, `carts(status, last_seen_at)`.

## 9. Secretos a pedir

- `ADMIN_NOTIFICATION_EMAIL` (tu correo). Lo pido con `add_secret` después de la migración.

## 10. Orden de ejecución

1. Migración (tablas + RLS + roles + triggers).
2. Configurar email domain (diálogo) → `setup_email_infra` → `scaffold_transactional_email`.
3. Pedir `ADMIN_NOTIFICATION_EMAIL`.
4. Auth (login + ruta protegida `_admin`).
5. Carrito (store + drawer + página).
6. Checkout + endpoint create-order + tracking abandoned.
7. Webhook MP actualizado + envío de correos.
8. Panel admin (dashboard, pedidos, detalle con copia de dirección, abandonados, clientes, configuración).
9. Te entrego el SQL para marcarte como admin con tu user_id.

## Lo que NO hace este plan

- Cotización automática de guía: el admin captura tracking manualmente. (Integración con API de paquetería sería trabajo adicional.)
- Panel del cliente para ver sus pedidos (no lo pediste).
- Notificación WhatsApp (elegiste solo correo).
