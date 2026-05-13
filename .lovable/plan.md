# Fase 1 — Infraestructura SEO/GEO

## Nota técnica importante (leer antes de aprobar)

El proyecto está en **TanStack Start con SSR**, no en Vite+React puro. Ya tiene un sistema de SEO server-side completo y mejor que `react-helmet-async`:

- `head()` por ruta con `meta`, `links`, `scripts` (JSON-LD) — emitido en el HTML inicial, 100% crawleable sin prerender extra.
- `<HeadContent />` ya montado en `__root.tsx`.
- Helpers `buildHead`, `organizationJsonLd`, `breadcrumbJsonLd`, `faqJsonLd` en `src/lib/seo.ts`.
- Server routes `sitemap.xml` y `robots.txt` ya funcionando.

**Instalar `react-helmet-async` aquí sería un downgrade**: rompe el SSR nativo de TanStack, duplica tags, y compite con `HeadContent`. Voy a cumplir el 100% de los requisitos usando el sistema nativo (mismas props, misma cobertura, mejor rendering). Si insistes en `react-helmet-async`, dímelo y replanteo, pero perderemos SSR limpio.

Lo mismo con `/public/sitemap.xml` y `/public/robots.txt` estáticos: ya tenemos versiones **dinámicas** server-rendered en `/sitemap.xml` y `/robots.txt`, que es estrictamente superior porque incluyen productos y rutas nuevas automáticamente.

---

## Lo que se hace en esta fase

### 1. Robots.txt — bots de IA explícitos
Reemplazar `src/routes/robots[.]txt.tsx` con allowlist explícita para Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, anthropic-ai, cohere-ai. Mantener `Sitemap:` apuntando al dinámico.

### 2. Sitemap — segmentado y con metadata
Reescribir `src/routes/sitemap[.]xml.tsx`:
- `<lastmod>`, `<changefreq>`, `<priority>` por URL.
- Incluir: estáticas, `/productos/[slug]` (de `data/products`), `/blog/[slug]` (de blog data), y `/peptidos/[ciudad]` (10 ciudades nuevas).
- Si en el futuro >500 URLs, dividir; por ahora un solo sitemap (tenemos ~80).
- Añadir endpoint `/sitemap-index.xml` opcional como puerta para escalar.

### 3. Root `head()` — defaults limpios y verificación
En `src/routes/__root.tsx`:
- `html lang="es-MX"` (ya está vía meta, lo movemos al elemento html).
- `<link rel="canonical">` por defecto vía cada `buildHead`.
- `<link rel="alternate" hreflang="es-MX">` y `x-default`.
- Quitar el title genérico actual del root (cada ruta lo sobreescribe — confirmar que no hay duplicados).
- Placeholders comentados para Google Search Console, GA4, Bing Webmaster, Meta Pixel, Microsoft Clarity (sin IDs reales — listos para pegar).
- `Organization` + `WebSite` + `SearchAction` JSON-LD a nivel root (aparecen en todas las páginas, correcto para schema.org).

### 4. `buildHead` — extender con campos faltantes
En `src/lib/seo.ts`:
- Soporte `noindex` → `<meta name="robots" content="noindex,nofollow">`.
- Soporte `alternateLanguages: [{lang, url}]` → genera `<link rel="alternate" hreflang>`.
- `og:url` automático desde canonical.
- Validación dev-only: warning en consola si title >60 o description fuera de 140-170.
- `ogImage` por defecto absoluto a `/og-image.png` (ya hecho, verificar).

### 5. Ciudades programáticas
- Nueva ruta `src/routes/peptidos.$ciudad.tsx` con loader que valida slug contra `src/data/cities.ts`.
- 10 ciudades: CDMX, Guadalajara, Monterrey, Tijuana, Puebla, Querétaro, Mérida, León, Hermosillo, Cancún.
- Cada ciudad: estado, tiempo de entrega estimado, párrafo intro único, 2 testimonios (recyclados de `data/testimonials` filtrados o generados), FAQ regional, top 6 productos embebidos. ~600 palabras únicas.
- Schema `LocalBusiness` con `areaServed` por ciudad + `BreadcrumbList`.
- Linkeadas desde footer.

### 6. Producto individual — reforzar PDP existente
- Title pattern: `{Nombre} {dosis-min}–{dosis-max} Mayoreo México | Distribuidor desde ${precio}`.
- Añadir secciones H2 que faltan (Mecanismo, Especificaciones, Cómo Comprar, FAQ específico) si no están — revisar caso por caso.
- Patrón AEO: párrafo "definición" estilo `{Producto} es {definición factual}` al inicio.
- `Product` schema ya existe, agregar `BreadcrumbList` y `FAQPage`.

### 7. Resumen empresa (página AEO)
Nueva ruta `src/routes/resumen-empresa.tsx`: datos clave en formato citable por LLMs (nombre, MOQ, ciudades servidas, métodos de pago Mercado Pago, tiempos de entrega, política de garantía). Schema `Organization` + `AboutPage`.

### 8. Footer
Agregar bloque de links: ciudades top, categorías top, resumen empresa, blog. Anchor text con keyword.

### 9. Verificación al final de la fase
Levantar dev y revisar 5 páginas representativas (home, /productos, /productos/retatrutida, /peptidos/cdmx, /blog) y reportar:
- Title length, description length, H1 único.
- JSON-LD válido (parsear).
- Robots/sitemap accesibles (HTTP 200).
- Hreflang presente.

---

## Lo que se difiere a fases siguientes (no en esta fase)

- **Fase 2 (Contenido)**: 12 blog posts pillar (1500–3000 palabras c/u). Es trabajo de redacción largo, mejor en lote separado.
- **Fase 3 (Performance)**: WebP/AVIF, preload de fuentes, auditoría Lighthouse formal. Conviene hacerlo después de que el contenido esté en su lugar.
- **GA4/GSC reales**: solo placeholders en esta fase. Los IDs los pegas tú cuando tengas las cuentas.

---

## Confirmaciones que necesito antes de implementar

1. **Stack de SEO**: ¿OK usar el sistema nativo TanStack `head()` (recomendado) en lugar de `react-helmet-async`?
2. **Dominio canonical**: ¿El definitivo es `https://peptidosmayoreo.com`? Lo necesito para canonical/OG/sitemap.
3. **Ciudades programáticas**: ¿OK crear las 10 con contenido auto-generado base (~600 palabras c/u con datos plausibles de tiempos de envío) o prefieres que primero solo cree la plantilla y tú me pasas el copy real ciudad por ciudad?
