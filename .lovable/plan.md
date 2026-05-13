## Fase 3 — Performance & Lighthouse

Objetivo: subir Lighthouse Performance ≥90 y SEO=100 sin tocar copy ni features. Trabajo 100% en assets, head() y atributos de imagen.

### 1. Convertir imágenes a WebP

- `public/og-image.png` (1.5MB) → `public/og-image.webp` + `og-image.jpg` fallback (~150–250KB). Actualizar `og:image`/`twitter:image` en `__root.tsx` y rutas que lo overridean.
- `src/assets/vial-*.jpg` y `hero-bg.jpg` (15–47KB c/u) → `.webp` con cwebp (q=82). Vite los inlinea/hashea igual.
- AVIF se omite: ganancia marginal vs WebP en este rango de tamaños y duplica build.

### 2. Atributos de `<img>`

Auditar cada `<img>` en `components/` y `routes/`:
- Hero / primer producto visible: `loading="eager"` + `fetchpriority="high"` + `decoding="async"`.
- Resto (grids de productos, blog cards, footer): `loading="lazy"` + `decoding="async"`.
- Todas: `width` y `height` explícitos para evitar CLS.
- Confirmar `alt` descriptivo con keyword (ej. `alt="Vial BPC-157 5mg mayoreo México"`).

### 3. Fuentes

Hoy se cargan vía `<link>` Google Fonts con `display=swap` (bien) pero bloquean render por CSS externo. Cambios:
- Mantener `preconnect` a `fonts.gstatic.com`.
- Agregar `<link rel="preload" as="style">` al CSS de Google Fonts para subir prioridad.
- Reducir pesos: Inter 400/600/700 (quitar 500 y 800), Geist 700/800 (quitar 600). Menos bytes de fuente, mismo render.

### 4. Recursos críticos en `<head>`

En `__root.tsx`:
- `<link rel="preload" as="image">` para `hero-bg.webp` (LCP del home).
- `<link rel="dns-prefetch">` para wa.me y mercadopago.

### 5. Cache headers

Verificar que `/sitemap.xml` y `/robots.txt` respondan con `Cache-Control: public, max-age=3600`. Hoy no setean header de cache.

### 6. JSON-LD: deduplicar

Hoy `Organization` y `WebSite` se emiten en root; `LocalBusiness` en cada ciudad; `Product` en cada PDP. Verificar que no haya dobles en rutas anidadas (root + child concatena scripts). Si aparece duplicado, mover Organization/WebSite solo a `/` y dejar el resto en su ruta.

### 7. Auditoría final

Correr Lighthouse contra preview en home, /productos, /productos/retatrutida, /peptidos/cdmx, /blog, /blog/semaglutida-vs-tirzepatida-cual-vender. Reportar Performance, SEO, Best Practices, Accessibility con antes/después y los hallazgos accionables que queden.

---

### Fuera de alcance (queda para fase futura)
- Self-hosting de fuentes con subset latin (gana ~150ms LCP, requiere bundling de woff2 en `/public`).
- Service worker / PWA.
- Code-splitting agresivo por ruta (TanStack ya lo hace por archivo).
- Reemplazo de framer-motion por CSS animations.

---

### Confirmaciones antes de implementar

1. **OG image**: ¿OK que regenere `og-image` a 1200×630 WebP+JPG (queda <200KB) reusando branding actual, o tienes una versión nueva que prefieres subir?
2. **Pesos de fuentes**: ¿OK reducir a Inter 400/600/700 + Geist 700/800? Si usas otro peso en algún lugar, dímelo.
3. **Lighthouse**: ¿Lo corro contra el preview de Lovable o esperas a tener `peptidosmayoreo.com` apuntado y lo medimos en producción?
