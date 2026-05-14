## Problema real
Google no está validando porque las páginas en el dominio que está indexando (`https://peptidosmayoreo.com`) todavía sirven HTML publicado viejo sin `aggregateRating`. El código actual y el dominio publicado de Lovable (`https://peptido-directo-mx.lovable.app`) sí contienen `aggregateRating`, `review` y `brand`.

Comprobé las 3 URLs afectadas:
- `https://peptidosmayoreo.com/productos/tirzepatida` → no contiene `aggregateRating`
- `https://peptidosmayoreo.com/productos/bpc-157` → no contiene `aggregateRating`
- `https://peptidosmayoreo.com/productos/retatrutida` → no contiene `aggregateRating`
- `https://peptido-directo-mx.lovable.app/productos/tirzepatida` → sí contiene `aggregateRating`

## Plan de arreglo
1. Crear una actualización mínima en el código de producto para forzar un nuevo despliegue con marcado Product JSON-LD completo.
2. Mantener `brand`, `aggregateRating` y `review` en el JSON-LD de todos los productos.
3. Verificar después del despliegue consultando el HTML real de las 3 URLs afectadas en `peptidosmayoreo.com` hasta confirmar que ya aparece `aggregateRating`.
4. Solo después de esa confirmación, validar en Google Search Console.

## Nota importante
No voy a decir que está arreglado hasta comprobar el HTML real en `peptidosmayoreo.com`, porque ahora mismo el preview/código está bien pero el dominio que Google revisa sigue sirviendo una versión vieja.