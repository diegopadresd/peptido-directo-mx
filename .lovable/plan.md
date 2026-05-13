## Hallazgos de la auditoría

Antes de proponer cambios, lo que verifiqué en el código:

- **#3 JSON-LD ya está implementado.** `Organization` + `WebSite` se inyectan en `__root.tsx` (líneas 100-101), `FAQPage` y `Organization` en home (`index.tsx`), `Product` + `Breadcrumb` + `FAQPage` en cada PDP, `LocalBusiness` en cada `/peptidos/$ciudad`. Se sirven via `head()` durante SSR. Si tu extractor no los vio, probablemente miró el HTML pre-hidratación o una build vieja. **Acción: verificar con `curl https://peptidosmayoreo.com/ | grep ld+json` y reportar — no es rebuild.**
- **#4 Blog ya tiene 12 posts** en `src/data/blog.ts` (`/blog`, `/blog/$slug`). No vacío.
- **#5 `/contacto` y `/resumen-empresa` existen** como archivos de ruta. Solo falta confirmar HTTP 200 en producción.
- **#6 Las 10 ciudades existen** en `src/data/cities.ts`: cdmx, guadalajara, monterrey, tijuana, puebla, queretaro, **merida, leon, hermosillo, cancun**. Footer solo lista 6, pero ninguna da 404.

**Lo que sí está roto y necesita fix de código (#1 y #2):**

Precios reales de BPC-157 en el catálogo (`src/data/products.ts`):
- Pack 10: `$450/vial`
- Pack 20: `$405/vial` (10% off)
- Pack 30: `$375/vial` (17% off — el más barato)

La home dice `$280/vial mayoreo` y la calculadora usa `$280` y promete `$10,300` de ganancia mensual. Inventado. Y a esos números les falta la inversión real (necesitarías ~17 viales × $280 = $4,760, pero a precio real serían $6,375 → no entra en $5,000).

## Cambios

### 1. `src/routes/index.tsx` — tabla comparativa (línea 133)
Reemplazar `["Precio por vial BPC-157", "$650 MXN", "$420 MXN", "$280 MXN"]` por números reales:

```text
["Precio por vial BPC-157 5mg", "$650 MXN", "$520 MXN", "$375 MXN"]
```

`$650` retail (queda), `$520` farmacia gris (entre retail y mayoreo), `$375` mayoreo pack 30 (real).

### 2. `src/routes/index.tsx` — calculadora distribuidor (líneas 177-222)

Reescribir con **matemática real del pack 30 de BPC-157**, escalando la inversión para que el headline siga siendo impactante y honesto:

```text
Headline: "Convierte $11,250 MXN en $27,000. Cada mes."
─────────────────────────────────────────────────
Inversión inicial          $11,250 MXN
30 viales BPC-157 5mg
(pack mayoreo)              $375/vial
Reventa a $900 MXN/vial    $27,000 MXN
─────────────────────────────────────────────────
Ganancia mensual           $15,750
```

Cuadra exacto: `30 × $375 = $11,250` (pack 30 real) y `30 × $900 = $27,000`. Margen `140%`.

Mantener bullet "Precios escalonados por pack (10 / 20 / 30 viales)" y CTA `/empezar-negocio` sin cambios.

### 3. Microcopy del hero/meta (opcional, mismo archivo)
Si en algún meta de home se menciona "$280", ajustar también — ya hice grep y no aparece más fuera de la calculadora y la tabla.

### 4. Validación post-deploy (sin cambios de código)
Después de publicar:
- `curl -s https://peptidosmayoreo.com/ | grep -c "application/ld+json"` → debe dar ≥2
- `curl -sI https://peptidosmayoreo.com/contacto` → 200
- `curl -sI https://peptidosmayoreo.com/resumen-empresa` → 200
- `curl -sI https://peptidosmayoreo.com/peptidos/merida` → 200 (y demás ciudades)

Si alguno falla te lo reporto y lo arreglo en una pasada corta.

## Lo que NO hago (queda explícitamente fuera)

- **No re-emitir JSON-LD** desde cero. Ya está. Solo verifico.
- **No agregar la palabra "Semaglutida" en la calculadora** aunque resolvería más fácil — Semaglutida no existe como producto en `src/data/products.ts` (solo se menciona en blog). Si el cliente busca "Semaglutida mayoreo" desde Google, llega al blog pero no a un PDP. Eso es un hueco real. **Te pregunto abajo si quieres que lo agregue como producto del catálogo en este mismo turno.**

## Pregunta antes de implementar

1. **¿Agrego Semaglutida al catálogo (`src/data/products.ts`)** con variantes 5mg y 10mg? El blog ya menciona precios `$850–$1,200 mayoreo / $1,800–$2,800 reventa`, lo alinearía con eso. Si sí, la calculadora se vuelve aún más impresionante:
   - Pack 30 Semaglutida 5mg @ $900 mayoreo = `$27,000 inversión → $54,000 reventa → $27,000 ganancia`.
   - Y cierras un keyword crítico ("comprar semaglutida mexico") que hoy solo te apunta al blog.
2. ¿O dejo el plan tal cual con BPC-157 y muevo Semaglutida a una tarea aparte?
