## Diagnóstico rápido

Sí hay datos registrándose actualmente:
- `page_views`: 266 visitas registradas, última visita reciente.
- `analytics_events`: 57 eventos registrados, principalmente `view_product` y algunos `add_to_cart`.

Pero el sistema está incompleto para un admin “100% funcional”:
- Los carritos abandonados no pueden funcionar bien porque no se está guardando/actualizando el carrito en la base de datos cuando el usuario agrega productos o deja datos.
- El checkout sí registra pedidos, pero el pago directo desde producto (`Pagar este producto ahora`) crea una preferencia de Mercado Pago sin crear un pedido interno, así que ese flujo no aparece completo en admin.
- El dashboard muestra números básicos, pero no incluye salud del tracking, conversión real, pedidos recientes, productos top, últimas visitas/eventos ni señales para saber si el sistema está capturando datos.
- El tracking depende del cliente y falla silenciosamente; si algo se rompe, el admin no se entera.

## Plan de implementación

1. **Hacer el tracking más confiable**
   - Mantener el registro de pageviews en todas las rutas públicas.
   - Registrar eventos clave: vista de producto, agregar al carrito, iniciar checkout, intento de pago, pedido creado, regreso de pago exitoso/fallido/pendiente.
   - Añadir metadata útil: subtotal, número de items, producto, dosis, cantidad, ruta y token de carrito.
   - Evitar que errores de analytics rompan la experiencia del comprador.

2. **Activar carritos reales y carritos abandonados**
   - Crear una función segura para guardar/actualizar el carrito desde el navegador usando el `cartToken` existente.
   - Sincronizar carrito al agregar, remover, vaciar y antes/durante checkout.
   - Capturar email/nombre/teléfono cuando el usuario llena checkout para que “Carritos abandonados” deje de estar vacío.
   - Marcar carritos como convertidos cuando se cree un pedido.

3. **Corregir el flujo de pago directo desde producto**
   - Cambiar `Pagar este producto ahora` para crear un pedido interno antes de redirigir a Mercado Pago, igual que el checkout normal.
   - Guardar items, total, referencia externa, eventos del pedido y preferencia de Mercado Pago.
   - Así el admin verá también esos pedidos, aunque el usuario no pase por el checkout completo.

4. **Mejorar el dashboard principal**
   - Mostrar métricas reales y accionables: ingresos hoy/7d/30d, pedidos por estado, visitas, sesiones, tasa producto→carrito→checkout→pedido, ticket promedio, carritos activos/abandonados.
   - Añadir secciones de “últimos pedidos”, “últimas visitas”, “últimos eventos”, “productos top” y “estado del tracking” con última visita/evento registrada.
   - Mostrar estados vacíos claros cuando no haya pedidos o eventos.

5. **Mejorar la página de Analytics**
   - Añadir KPIs arriba, no solo tablas.
   - Mostrar embudo con porcentajes de conversión, top páginas, top productos, add-to-cart, referrers, UTM, dispositivos y búsquedas.
   - Añadir rangos 1/7/30/90 días como ya existe, pero con datos normalizados y más robustos.

6. **Fortalecer funciones admin del backend**
   - Extender `admin_dashboard_summary` y `admin_analytics` para devolver todos los datos nuevos en una sola llamada eficiente.
   - Mantener seguridad admin con roles del backend, sin exponer datos personales públicamente.
   - Usar Lovable Cloud con RLS/admin server functions; nada de lógica sensible en cliente.

7. **Validación final**
   - Verificar en base de datos que una visita nueva y un evento nuevo se inserten.
   - Verificar que agregar al carrito cree/actualice una fila de carrito.
   - Verificar que el admin dashboard y analytics lean datos reales.
   - Revisar que no haya errores del navegador ni fallos de server functions.

## Archivos que se tocarían

- `src/lib/analytics/track.ts`
- `src/lib/cart/store.ts`
- `src/lib/admin.functions.ts`
- `src/routes/admin.index.tsx`
- `src/routes/admin.analytics.tsx`
- `src/routes/admin.carritos.tsx`
- `src/routes/productos.$slug.tsx`
- `src/components/site/ConcentrationVolumePicker.tsx`
- `src/routes/checkout.tsx`
- `src/routes/api.checkout.create-order.ts`
- `src/routes/api.checkout.mercadopago.ts`
- Migración de base de datos para funciones RPC de carrito/analytics si hace falta

## Resultado esperado

El panel admin quedará como una herramienta operativa real: visitas, eventos, productos vistos, carritos, pedidos, conversiones y pagos se registrarán y serán visibles de forma confiable, no solo como métricas superficiales.