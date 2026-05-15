Diagnóstico verificado antes de tocar código:
- La base de datos sí está registrando visitas: hay 291 page views y el último registro se creó durante esta revisión.
- Analytics events existen: 59 registros.
- Carritos y pedidos sí están en 0 actualmente porque no hay registros reales en esas tablas.
- La función actual `admin_dashboard_summary()` falla con `forbidden` cuando se ejecuta sin sesión admin SQL (`auth.uid()`), y el panel depende de esa función para pintar métricas.
- En preview, `/admin` no llegó a solicitar datos del dashboard; se quedó verificando acceso y terminó en `/login`. Esto explica por qué el usuario ve cero/sin datos aunque la base tenga visitas.

Plan de reparación:

1. Separar lectura admin de RPC frágil
- Rehacer `adminGetDashboard` para que no dependa de `admin_dashboard_summary()` ni de `auth.uid()` dentro de SQL.
- Mantener la validación de admin en servidor con `assertAdmin(context.userId)`.
- Después de validar el rol, leer directamente con el cliente admin del servidor:
  - conteos de `page_views`, `analytics_events`, `carts`, `orders`
  - visitas 1d/7d/30d y sesiones 1d/7d/30d
  - últimos page views y eventos
  - productos más vistos
  - pedidos recientes
  - salud del sistema con última visita/evento/carrito/pedido
- Resultado: si el usuario es admin, los datos salen de la fuente real y no de una función SQL que puede rechazar por contexto de autenticación.

2. Rehacer `adminGetAnalytics` con lecturas server-side directas
- Eliminar la dependencia de `admin_analytics()` para la pantalla Analytics.
- Calcular en TypeScript/server con consultas directas:
  - páginas más vistas
  - referrers
  - dispositivos
  - UTM
  - productos vistos
  - add-to-cart
  - búsquedas
  - embudo
- Resultado: Analytics deja de depender de RPC bajo contexto SQL y deja de mostrar cero por fallo silencioso.

3. Eliminar ceros silenciosos en el UI
- Cambiar el dashboard para mostrar un error visible si el servidor falla, no normalizar todo a 0 como si fuera dato real.
- Agregar un bloque “Datos crudos” con:
  - total `page_views`
  - total `analytics_events`
  - total `carts`
  - total `orders`
- Mostrar claramente:
  - “visitas registradas” cuando existan visitas
  - “no hay carritos reales guardados” cuando `carts = 0`
  - “no hay pedidos reales creados” cuando `orders = 0`

4. Arreglar el acceso admin para que no se quede colgado
- Convertir `/admin` a una verificación determinista:
  - esperar sesión con `supabase.auth.getUser()` / `getSession()`
  - si no hay sesión, redirigir a `/login`
  - si hay sesión, verificar rol con servidor o RPC de forma clara
- Evitar estados infinitos de “Verificando acceso…”.
- Si la cuenta no es admin, mostrar “sin rol admin” explícitamente.

5. Validar tracking real después del cambio
- Probar una visita pública y confirmar que incrementa `page_views`.
- Probar `/admin` con sesión admin cuando esté disponible y confirmar que muestra los conteos reales.
- Si no hay sesión admin en el entorno de prueba, dejar el dashboard preparado para mostrar un diagnóstico claro en vez de ceros.

Archivos a cambiar:
- `src/lib/admin.functions.ts`
- `src/routes/admin.tsx`
- `src/routes/admin.index.tsx`
- `src/routes/admin.analytics.tsx`
- posiblemente `src/lib/admin-client.ts`

No haré migración inicialmente porque la base ya tiene datos y el problema verificado es la ruta de lectura/autenticación del dashboard, no el tracking de page views.