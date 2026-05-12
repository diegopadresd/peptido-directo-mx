# Plan: Péptidos Mayoreo — B2B Wholesale Site

Build a Spanish-language B2B peptide wholesale site on TanStack Start with industrial/clean design (electric blue + cyan), shadcn/ui, and WhatsApp-driven conversion. This phase delivers the full site skeleton, SEO infrastructure, home page, and the supporting pages. Product detail pages get scaffolded with 8 sample peptides; deep per-product copy can be iterated next.

Note: replacing "sexual" category with **"Bienestar íntimo"** (PT-141) to avoid blacklist triggers.

---

## 1. Design System (`src/styles.css`)

Replace default tokens with the brand palette in `oklch`:
- `--background` white, `--muted` light gray (#F7F9FC)
- `--foreground` charcoal (#1A1A1A)
- `--primary` deep electric blue (#0A2540)
- `--accent` bright cyan (#00D4FF)
- `--success` emerald (#00C896) — new token, register in `@theme inline`
- `--radius` 0.5rem (8px)
- Add `font-sans: Inter`, `font-display: Geist` via Google Fonts `<link>` in root head
- Tabular-nums utility class for prices

## 2. SEO Infrastructure

TanStack Start uses route-level `head()` (not react-helmet). Build a helper instead of react-helmet-async:

- `src/lib/seo.ts` — `buildHead({ title, description, canonical, ogImage, keywords, jsonLd })` returning the `head()` object with meta + script tags. Used by every route.
- `src/routes/sitemap[.]xml.tsx` — server route generating sitemap from a central `src/data/routes.ts` registry (static pages + product slugs).
- `src/routes/robots[.]txt.tsx` — server route returning robots.txt with sitemap pointer.
- `public/og-image.png` — generated 1200×630 brand image.
- JSON-LD: Organization (home), Product + Offer (each product), FAQPage (FAQ + per-product FAQ), BreadcrumbList (subpages).

## 3. Routes (file-based, flat dot-naming)

```
src/routes/
  __root.tsx              shell + Header + Footer + WhatsApp FAB + cookie banner
  index.tsx               Home
  productos.tsx           Catálogo con filtros
  productos.$slug.tsx     PDP programmatic
  como-funciona.tsx
  empezar-negocio.tsx
  distribuidor.tsx        Tiered bulk pricing
  preguntas-frecuentes.tsx
  contacto.tsx
  blog.tsx
  blog.$slug.tsx
  sitemap[.]xml.tsx
  robots[.]txt.tsx
```

## 4. Shared Components (`src/components/`)

- `Header.tsx` — logo, nav (Productos, Cómo funciona, Distribuidor, Blog, Contacto), CTA WhatsApp
- `Footer.tsx` — legal disclaimers (COFEPRIS, research-use), links, social
- `WhatsAppFAB.tsx` — fixed bottom-right, configurable prefilled message via `src/lib/whatsapp.ts` (`buildWaLink(message)`)
- `MobileStickyCTA.tsx` — bottom-fixed on PDPs (mobile)
- `ProductCard.tsx`, `PricingTiers.tsx`, `CategoryFilter.tsx`
- `TrustBadges.tsx`, `ComparisonTable.tsx`, `StepCards.tsx`, `TestimonialGrid.tsx`, `FAQAccordion.tsx` (uses shadcn Accordion)
- `CookieBanner.tsx` — LFPDPPP-compliant, localStorage dismiss
- `Breadcrumbs.tsx` — emits BreadcrumbList JSON-LD
- `AnalyticsScripts.tsx` — GA4 + Meta Pixel placeholders gated by env IDs (noscript pixel goes in `<body>`, not `<head>`)

## 5. Data Layer (`src/data/`)

- `products.ts` — typed `Product[]` with: slug, name, category, mgPerVial, image, shortDesc, longDesc, mechanism, dosing, storage, tiers (10–24, 25–49, 50–99, 100+), faqs, related.
- Seed 8 products: BPC-157, Semaglutida, Tirzepatida, CJC-1295, Ipamorelin, BPC+TB500 stack, Retatrutide, Melanotan II.
- `categories.ts` — Pérdida de peso, Crecimiento muscular, Recuperación, Anti-aging, Bronceado, **Bienestar íntimo**, Cognitivo.
- `testimonials.ts`, `faqs.ts`, `routes.ts` (sitemap source).

## 6. Home Page Sections

Hero → Cómo funciona (3 steps) → Comparison table (retail vs gris vs mayoreo) → Best sellers (6 cards) → Empieza tu negocio teaser → Testimonials → FAQ snippet (5 Q with FAQPage schema) → Final WhatsApp CTA.

## 7. Other Pages (this phase)

- **/productos** — grid + category filter + price sort (client state)
- **/productos/$slug** — H1 "[Nombre] Mayoreo - Precio Distribuidor México", tier table, technical specs, mechanism, dosing w/ research-use disclaimer, related, per-product FAQ + WhatsApp quote CTA prefilled with product
- **/como-funciona** — model explanation, shipping timeline, payment methods (transferencia/OXXO/USDT)
- **/empezar-negocio** — earnings calculator (simple inputs → output), what-you-get bullets, 3-step start, WA CTA
- **/distribuidor** — escalated tier pricing for 50+ resellers
- **/preguntas-frecuentes** — full FAQ with FAQPage schema
- **/contacto** — WhatsApp primary, email secondary, hours
- **/blog** + **/blog/$slug** — placeholder index + 1 sample post for SEO scaffolding

## 8. Images

Generate via imagegen (fast tier):
- 1× hero background (industrial/B2B)
- 1× og-image.png (brand card 1200×630, premium tier for text)
- 8× product vial images (consistent style, transparent or white bg)
- 3× testimonial avatars (or initials, decide during build)

## 9. Performance

- `loading="lazy"` on all non-hero images
- Width/height on all `<img>` to avoid CLS
- Preconnect Google Fonts in root head
- Mobile-first Tailwind classes; tap targets ≥44px

## 10. Out of scope (next iterations)

- Deep editorial copy per product (8 placeholders shipped, refined later)
- Real blog posts (1 sample only)
- Backend (Lovable Cloud) — not needed; everything is static + WhatsApp handoff
- Real GA4 / Meta Pixel IDs (placeholders only)

---

## Technical notes

- TanStack Start file-based routing; no react-router-dom, no react-helmet.
- Server routes for `sitemap.xml` / `robots.txt` use the `[.]` escape in filename.
- WhatsApp number stored in `src/lib/whatsapp.ts` as a single constant for easy swap.
- All colors via semantic tokens — no hardcoded hex in components.
- Each route's `head()` returns unique title/description/og + JSON-LD as needed.
