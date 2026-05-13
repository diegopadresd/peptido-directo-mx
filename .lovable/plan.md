## Plan: Reglas de carrito + lenguaje + envío + rediseño visual estilo RunAds.ai

### 1. Carrito: 1 producto = 1 paquete (sin mezclar viales)

Cambio de modelo: el carrito **no permite mezclar compuestos**. Cada línea del carrito es **un único compuesto + una única dosis + un pack fijo (10/20/30 viales)**.

- `src/data/products.ts`: sin cambios estructurales.
- `src/lib/pricing.ts`: PACKS sigue igual (`{10,x10}`, `{20,x18}`, `{30,x25}`).
- **Carrito**: en lugar de un carrito multi-item tipo e-commerce, será un **"pedido único"**:
  - El usuario entra a un PDP, elige dosis, elige pack (10/20/30) y hace click en "Comprar ahora".
  - Va directo a `/pago` con ese único item (sin drawer multi-producto, sin mezclar SKUs).
  - Si quiere otro compuesto, debe completar otra orden por separado (mensaje claro: "Cada pedido es de un solo compuesto. Para combinar, contáctanos por WhatsApp.").
- Componentes a simplificar:
  - `CartDrawer` → eliminado o reducido a un mini-resumen del item actual.
  - `AddToCartButton` → renombrado a `BuyNowButton`, navega a `/pago?slug=...&dose=...&qty=10`.
  - `/carrito` → eliminado o redirige a `/pago` con los params.
  - `/pago` lee los params, recalcula precio server-side y crea la preferencia MP.
- Validación server-side en `createMpPreference`: rechaza payloads con más de un `product_slug` distinto.
- DB `order_items`: sigue con la estructura, pero en la práctica cada `order` tendrá exactamente 1 row.

### 2. Lenguaje: quitar groserías

Reemplazar "pendejadas" (y similares) en todo el copy por alternativas neutras:
- "sin pendejadas" → **"sin rodeos"**, **"sin vueltas"**, **"directo al grano"**.
- Pasada con `rg` por todo `src/` (componentes, datos, FAQs, blog, copy de productos) para reemplazos consistentes.

### 3. Envío: 10–20 días en lugar de 15–25

Reemplazo global "15-25" / "15 a 25" → **"10-20"** / **"10 a 20"** en:
- Header banner / sticky bar
- Home (hero, cómo funciona, FAQs)
- `/como-funciona`, `/preguntas-frecuentes`, `/empezar-negocio`, `/distribuidor`
- PDPs (badge de envío)
- Footer
- JSON-LD (`shippingDetails.deliveryTime`)
- Meta descriptions

### 4. Rediseño visual: vibe RunAds.ai

RunAds.ai es **blanco brillante + azul vivo + tipografía display negra muy bold + mucho espacio en blanco + pills suaves azul-claro + botones redondeados con flecha**. Aplicar al sitio entero (no es un cambio de un solo componente):

**Tokens (`src/styles.css`)** — actualizar `:root`:
- `--background`: blanco puro `oklch(1 0 0)`
- `--foreground`: casi negro `oklch(0.145 0 0)`
- `--primary`: azul RunAds `oklch(0.55 0.22 260)` (~#155EEF)
- `--primary-foreground`: blanco
- `--accent`: azul muy claro pill `oklch(0.96 0.03 255)`
- `--muted`: gris muy claro `oklch(0.97 0.005 255)`
- `--muted-foreground`: gris medio `oklch(0.5 0.02 255)`
- `--border`: `oklch(0.93 0.01 255)`
- `--radius`: `0.75rem` (botones más redondeados, tipo pill en CTAs principales)
- Nuevo `--gradient-hero`: sutil blanco a azul-claro top-left.
- Nuevo `--shadow-soft`: `0 1px 3px oklch(0 0 0 / 0.04)` y `--shadow-card`: `0 10px 40px -10px oklch(0.55 0.22 260 / 0.15)`.

**Tipografía**:
- Display: **Inter** o **Geist** muy bold (700–800) para H1/H2, tracking ajustado tipo `-0.02em`.
- Body: misma familia, peso 400/500.
- Importar via Google Fonts en `__root.tsx` head.

**Componentes a refrescar (sin cambiar funcionalidad)**:
- **Header**: fondo blanco, logo a la izquierda, nav centrado, botones "Iniciar sesión" texto + "Comprar ahora" pill azul a la derecha. Border-bottom súper sutil.
- **Hero (home)**: H1 negro masivo en 2 líneas con la 2ª línea en azul (mimic "Launch Google Ads in minutes. Fully managed by AI."). Pill azul-claro arriba con badge ("Envío directo desde China · 10-20 días"). 2 CTAs: primario azul redondeado con flecha → y secundario ghost con ▶ "Cómo funciona". A la derecha, mockup/foto producto en card con shadow suave.
- **Sections**: alternar fondo blanco / `--muted` muy claro. Headers de sección centrados con pill arriba ("BONUS · CATÁLOGO · ETC").
- **Cards de producto**: blanco, border 1px sutil, radius 12px, hover lift + shadow azul suave. Precio "desde $X/vial" en negro bold.
- **PDP**: layout 2 columnas, imagen izquierda en card, derecha selector de dosis + 3 cards de pack (10/20/30) con la opción "más popular" (20) con border azul. CTA "Comprar ahora" azul pill full-width.
- **Footer**: blanco/muted, links en columnas, branding.
- **Botones primarios**: `rounded-full` con icono `ArrowRight` al final.
- **Pills/badges**: `bg-accent text-primary rounded-full px-3 py-1 text-xs font-medium`.
- **WhatsApp FAB**: mantener pero estilo más minimal (verde estándar).

Estructura de páginas se mantiene (no rehacemos rutas). Solo cambia el look & feel.

### 5. Orden de ejecución

1. Refactor de carrito → "pedido único" + `/carrito` eliminado, `BuyNowButton`, validación server-side.
2. Reemplazos globales de copy: groserías + "15-25" → "10-20".
3. Update de tokens en `src/styles.css` + fuente.
4. Refresh visual de Header, Hero, ProductCard, PDP, Footer, FAQ, secciones.
5. QA en preview: home, 1 PDP, flujo "Comprar ahora" → `/pago`.

### Fuera de alcance
- Mercado Pago real (sigue pendiente del secret en sandbox; lo enchufamos cuando lo apruebes).
- Cambios al schema de DB (la estructura permite 1 item por orden sin migración).