## Objetivo

1. Reemplazar el placeholder "PM" por el logo SVG nuevo en header y footer.
2. Forzar scroll al tope al navegar entre rutas (a pesar de `scrollRestoration: true`, en SPA quedan posiciones residuales en algunos casos como links internos a la misma sección o navegación tras filtros).
3. Auditar y pulir mobile en todo el sitio (≤768px).

## 1. Logo

- Copiar `user-uploads://peptidos-mayoreo-logo.svg` a `src/assets/peptidos-mayoreo-logo.svg`.
- Crear variante compacta (solo chevron) `src/assets/peptidos-mayoreo-mark.svg` para mobile (<sm) y favicon, manteniendo la versión completa para sm+.
- `src/components/site/Header.tsx`: reemplazar el badge "PM" + texto por `<img src={logo} alt="Péptidos Mayoreo" class="h-8 w-auto sm:h-9" />`. Quitar el `<span>` redundante. Mantener `<Link to="/">`.
- `src/components/site/Footer.tsx`: añadir el logo arriba del bloque de marca (si aplica) o sustituir el texto principal. Mantener tagline.
- `public/favicon.ico` → además generar `public/favicon.svg` desde el mark para navegadores modernos. Actualizar `<link rel="icon">` en `__root.tsx` head.
- Actualizar `og:image` solo si el usuario lo pide (no en este pase, ya existe `og-image.webp`).

## 2. Auto scroll-to-top global

Aunque `scrollRestoration: true` está activo, restaura la posición previa al usar back/forward. Para forward navigations queremos siempre top. Añadir un componente `ScrollToTop` en `src/routes/__root.tsx` que escuche `useRouterState({ select: s => s.location.pathname })` y haga `window.scrollTo({ top: 0, behavior: 'instant' })` cuando cambia el pathname (ignorando hash anchors para no romper TOCs).

## 3. Mobile optimization (auditoría dirigida, sin rediseño)

Recorrer en viewport 375px y corregir issues comunes:

- **Header**: ya colapsa a hamburguesa; verificar logo no overflow, CTA "Comprar ahora" oculto en `<md` está bien.
- **`index.tsx` (Home)**: tabla comparativa BPC-157 y calculadora distribuidor → garantizar `overflow-x-auto` en tablas, tipografía hero `text-3xl sm:text-5xl`, padding `px-4`, grids `grid-cols-1 md:grid-cols-3`.
- **`productos.$slug.tsx` (PDP)**: `ConcentrationVolumePicker` selects/botones full-width, sticky CTA inferior en mobile, imágenes `w-full h-auto`.
- **`ConcentrationVolumePicker.tsx`: botón Mercado Pago + WhatsApp `flex-col sm:flex-row gap-3`, tap targets ≥44px.
- **`Footer.tsx`**: columnas `grid-cols-2 md:grid-cols-4`, tipografía legible.
- **`peptidos.$ciudad.tsx`, `blog.$slug.tsx`, `como-funciona.tsx`, `distribuidor.tsx`, `empezar-negocio.tsx`, `contacto.tsx`, `resumen-empresa.tsx`, `preguntas-frecuentes.tsx`**: revisar containers tienen `px-4`, headings escalan con breakpoints, no hay anchos fijos en px que rompan a 360px, imágenes con `max-w-full`.
- **WhatsAppFAB**: confirmar `bottom-4 right-4` y z-index correcto sobre CTAs.
- **CookieBanner**: que no tape el FAB en mobile.
- Añadir `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` (verificar que ya está).

QA final con screenshots a 375×812 de: home, PDP, catálogo, una ciudad, un blog post, checkout success.

## Archivos afectados

- nuevo: `src/assets/peptidos-mayoreo-logo.svg`, `src/assets/peptidos-mayoreo-mark.svg`, `public/favicon.svg`
- editado: `src/components/site/Header.tsx`, `src/components/site/Footer.tsx`, `src/routes/__root.tsx` (ScrollToTop + favicon link), y los route/component files con fixes mobile puntuales listados arriba.

## Fuera de alcance

- No cambios de copy ni de funcionalidad de Mercado Pago.
- No rediseño visual; solo pulido responsive y logo.
