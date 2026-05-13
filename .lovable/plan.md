## Diagnóstico

El sistema de blog **sí funciona**: hay 12 posts en `src/data/blog.ts`, todos ruteados por `src/routes/blog.$slug.tsx` con SSR, JSON-LD (`BlogPosting`, `BreadcrumbList`, `FAQPage`) y meta canónica. La captura de Google que enviaste (`/blog/errores-comunes-revendedores-peptidos`) confirma que ya están indexando.

Pero hay dos huecos reales que hacen que parezca "roto":

1. **No existe `/sitemap.xml`** — `public/robots.txt` lo anuncia pero no hay ruta que lo sirva. Google encuentra posts por enlaces internos pero no tiene índice canónico → algunos posts pueden tardar meses en indexarse o quedar fuera.
2. **`public/robots.txt` (estático) coexiste con `src/routes/robots[.]txt.tsx` (dinámica)** — el estático gana y puede divergir. Hay que unificar.

No hay blogs "rotos" en el sentido literal (ningún `related` apunta a un slug inexistente, todas las rutas resuelven). Lo que falta es **volumen + sitemap** para acelerar indexación y rankear más términos.

## Plan

### 1. Crear `/sitemap.xml` dinámico

Nueva ruta `src/routes/sitemap[.]xml.tsx` que sirva XML con:
- Páginas core (`/`, `/productos`, `/blog`, `/como-funciona`, `/contacto`, `/empezar-negocio`, `/distribuidor`, `/preguntas-frecuentes`, `/resumen-empresa`)
- Todos los productos (de `src/data/productos`)
- Todas las ciudades (`/peptidos/$ciudad`)
- **Los 12 posts existentes + los 10 nuevos = 22 entradas de blog**

Base URL: `https://peptidosmayoreo.com`. `lastmod` desde `post.date` para posts.

### 2. Limpiar duplicado de robots

Borrar `public/robots.txt` y dejar solo `src/routes/robots[.]txt.tsx` como fuente única (ya apunta correctamente al sitemap).

### 3. Escribir 10 nuevos posts con SEO fuerte

Apuntando a keywords con intención comercial real en MX, sin canibalizar los 12 existentes. Cada post sigue el mismo formato (`intro`, `sections` con `heading/paragraphs/list`, `faq`, `related`, tags), 1500–2200 palabras equivalente, fechas escalonadas en mayo 2026 para parecer fresco, y enlaces internos cruzados con los existentes para reforzar topical authority.

Slugs y keyword target:

| # | Slug | Keyword principal | Volumen/intención |
|---|------|-------------------|-------------------|
| 1 | `comprar-semaglutida-mayoreo-mexico` | "comprar semaglutida mayoreo méxico" | comercial alta |
| 2 | `tirzepatida-precio-mexico-mayoreo` | "tirzepatida precio méxico" | comercial alta |
| 3 | `peptidos-para-bajar-de-peso-mexico` | "péptidos para bajar de peso" | informacional+comercial |
| 4 | `bpc-157-tb-500-stack-recuperacion` | "bpc 157 tb 500 stack" | nicho gym |
| 5 | `melanotan-2-mayoreo-mexico-guia-distribuidores` | "melanotan 2 méxico" | nicho estética |
| 6 | `glp-1-microdosing-tendencia-2025` | "microdosing semaglutida" | tendencia / tráfico |
| 7 | `como-reconstituir-peptidos-guia-clientes` | "cómo reconstituir péptidos" | how-to alto volumen |
| 8 | `certificado-analisis-peptidos-que-buscar` | "certificado de análisis péptidos" | trust / B2B |
| 9 | `distribuidor-peptidos-cdmx-guadalajara-monterrey` | "distribuidor péptidos cdmx" | local SEO (refuerza `/peptidos/$ciudad`) |
| 10 | `tesamorelin-grasa-visceral-mercado-mexicano` | "tesamorelin méxico" | nicho premium |

Cada post incluirá:
- `<title>` con keyword principal + marca
- `excerpt` 150–160 chars con CTA implícito
- 5–7 secciones con `H2`s usando variantes de la keyword (LSI)
- Tabla de precios o lista numerada (favorece featured snippets)
- 3–5 FAQs (genera FAQPage rich result)
- 3 `related` apuntando a posts existentes relevantes
- Tags consistentes con el taxonomía actual

### 4. Verificación

- Abrir `/sitemap.xml` en el preview y confirmar XML válido con las 22 URLs de blog.
- Abrir 3 de los nuevos posts (`/blog/comprar-semaglutida-mayoreo-mexico`, `/blog/peptidos-para-bajar-de-peso-mexico`, `/blog/como-reconstituir-peptidos-guia-clientes`) y confirmar que cargan, muestran FAQ y tienen meta correcta.
- Confirmar que el listado `/blog` muestra 22 cards.

## Archivos tocados

- **Nuevo**: `src/routes/sitemap[.]xml.tsx`
- **Edit**: `src/data/blog.ts` (agregar 10 entradas al array `posts`)
- **Delete**: `public/robots.txt`

## Una pregunta antes de ejecutar

¿Quieres que los 10 posts incluyan **precios concretos en MXN** (como ya hacen los existentes — esto sube conversión pero también te ata a actualizarlos), o prefieres que sea contenido más atemporal con rangos genéricos / "consultar catálogo"?
