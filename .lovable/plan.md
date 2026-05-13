# Arreglar páginas de producto individuales

## Causa raíz

En TanStack Router, `productos.tsx` + `productos.$slug.tsx` hacen que `/productos` sea un **layout padre** del slug. El componente del catálogo no incluye `<Outlet />`, así que al hacer click en una tarjeta:

- La URL cambia a `/productos/retatrutida` ✅
- Pero como el padre no tiene `<Outlet />`, la PDP nunca se monta y solo se sigue viendo el catálogo ❌

## Fix

1. Renombrar `src/routes/productos.tsx` → `src/routes/productos.index.tsx`
   - Esto convierte `/productos` en una ruta hoja independiente
   - `/productos/$slug` queda como hermano, no como hijo
   - No requiere cambios en el contenido del archivo (la declaración `createFileRoute("/productos")` sigue válida porque `index` se mapea a `/productos`)

2. Verificar en el navegador que al click en Retatrutida se renderice la PDP correctamente.

No se tocan datos, estilos, ni otros componentes.
