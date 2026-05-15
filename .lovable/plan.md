Diagnóstico directo: el backend sí tiene datos de visitas, pero el admin no los está mostrando porque el flujo de acceso/carga del panel está frágil y puede quedarse atorado en “Verificando acceso…”. Además, carritos y pedidos sí están en 0 porque todavía no se han persistido desde interacciones reales después del cambio, y el panel no explica esa diferencia.

Plan de reparación completa:

1. Arreglar el acceso al admin
- Convertir `/admin` en una ruta protegida real con `beforeLoad`, no una verificación manual dentro del componente.
- Esperar correctamente la sesión del usuario y redirigir a `/login` solo si no hay sesión.
- Verificar el rol admin de forma estable antes de renderizar el dashboard.
- Evitar estados infinitos como “Verificando acceso…”. Si falla, mostrar error accionable.

2. Hacer que el dashboard use una fuente de verdad confiable
- Rehacer `adminGetDashboard` para leer con acceso admin del servidor, no depender de llamadas RPC bajo el contexto del cliente cuando no sea necesario.
- Devolver explícitamente visitas, sesiones, eventos, productos vistos, carritos, pedidos y estado de tracking.
- Mostrar “sin datos” solo cuando realmente no existan datos, no convertir errores silenciosamente a 0.

3. Separar métricas reales de métricas todavía inexistentes
- Visitas y eventos: mostrar los números reales que ya existen en la base de datos.
- Pedidos: mostrar 0 con nota clara si no hay pedidos creados.
- Carritos: mostrar 0 solo si no hay carritos persistidos, y añadir indicador de si la sincronización de carritos está funcionando.
- Añadir una barra de salud con última visita, último evento, último carrito, último pedido y errores recientes.

4. Fortalecer tracking y carritos
- Hacer que el carrito se sincronice al cargar la app si ya existe carrito local, no solo cuando se agrega/remueve un producto.
- Asegurar que “add to cart”, “checkout”, “submit checkout” y “order_created” registren evento y metadata útil.
- Ajustar el panel de carritos para poder ver carritos activos y abandonados, no solamente abandonados con email después de 1 hora.

5. Reparar pedidos de punta a punta
- Mantener el checkout creando pedido interno antes de Mercado Pago.
- Revisar que el endpoint de creación de pedido marque el carrito como convertido y registre eventos internos.
- Eliminar o dejar fuera de uso el endpoint viejo `/api/checkout/mercadopago` que crea pagos sin pedido interno, para que no vuelva a romper el admin.

6. Hacer el admin auditable
- Añadir una sección “Estado del sistema” dentro del admin con conteos crudos: `page_views`, `analytics_events`, `carts`, `orders`.
- Añadir listas recientes de visitas/eventos para confirmar visualmente que se está registrando actividad.
- En Analytics, mostrar embudo real con porcentajes y tablas de páginas/productos/referrers/dispositivos.

7. Validación final
- Probar una visita pública y confirmar que aparece en dashboard.
- Probar agregar producto al carrito y confirmar que aparece como carrito activo.
- Probar iniciar checkout y confirmar evento + carrito con datos de cliente.
- Revisar consola/red para asegurar que no haya errores silenciosos.

Archivos principales a tocar:
- `src/routes/admin.tsx`
- `src/routes/admin.index.tsx`
- `src/routes/admin.analytics.tsx`
- `src/routes/admin.carritos.tsx`
- `src/lib/admin.functions.ts`
- `src/lib/cart/store.ts`
- `src/lib/analytics/track.ts`
- `src/routes/api.checkout.create-order.ts`
- posiblemente una migración para mejorar funciones SQL/índices si hace falta

Resultado esperado: el admin deja de quedarse en verificación, muestra las visitas reales existentes, distingue correctamente qué métricas están en 0 por falta de pedidos/carritos reales, y permite validar desde el propio panel que tracking, carritos y pedidos están funcionando.