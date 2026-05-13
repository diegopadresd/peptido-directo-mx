import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Beaker, Snowflake, Truck } from "lucide-react";
import { getProduct, products, minBasePrice } from "@/data/products";
import { categories } from "@/data/categories";
import { PricingTiers } from "@/components/site/PricingTiers";
import { ConcentrationVolumePicker } from "@/components/site/ConcentrationVolumePicker";
import { ProductCard } from "@/components/site/ProductCard";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { PACKS, packTotal } from "@/lib/pricing";
import { buildHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/productos/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const p = loaderData.product;
    const minPerVial = minBasePrice(p);
    const maxPerVial = Math.max(...p.variants.map((v) => v.basePricePerVial));
    const dosesLabel = p.variants.map((v) => v.dose).join(" / ");
    const cat = categories.find((c) => c.slug === p.category);
    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.shortDesc,
      image: `${SITE_URL}${p.image}`,
      sku: p.slug,
      category: cat?.name,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "MXN",
        lowPrice: minPerVial,
        highPrice: packTotal(maxPerVial, PACKS[PACKS.length - 1].qty),
        offerCount: p.variants.length * PACKS.length,
        availability: "https://schema.org/InStock",
      },
    };
    return buildHead({
      title: `${p.name} Mayoreo (${dosesLabel}) - Precio Distribuidor México`,
      description: `${p.name} ${dosesLabel} al mayoreo desde $${minPerVial} MXN/vial. Pack mínimo 10 viales. Pago Mercado Pago. Envío 10-20 días a todo México.`,
      canonical: `/productos/${p.slug}`,
      keywords: p.keywords,
      type: "product",
      ogImage: `${SITE_URL}${p.image}`,
      jsonLd: [
        productLd,
        breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Catálogo", url: "/productos" },
          { name: p.name, url: `/productos/${p.slug}` },
        ]),
        ...(p.faqs.length ? [faqJsonLd(p.faqs)] : []),
      ],
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const cat = categories.find((c) => c.slug === p.category);
  const minPrice = minBasePrice(p);
  const related = p.related
    .map((s: string) => getProduct(s))
    .filter(Boolean) as typeof products;

  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <Link to="/productos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al catálogo
        </Link>
      </div>

      <div className="container mx-auto grid gap-12 px-4 py-8 lg:grid-cols-2 lg:py-14">
        <div className="overflow-hidden rounded-3xl border border-border bg-muted shadow-card">
          <img
            src={p.image}
            alt={`${p.name} vial mayoreo México`}
            width={800}
            height={800}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {cat && (
              <span className="inline-flex items-center rounded-full border border-primary bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                {cat.name}
              </span>
            )}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Research-only · Síntesis de alta pureza
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl md:text-6xl">
            {p.name}
          </h1>
          {p.tags && p.tags.length > 0 && (
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-primary">
              {p.tags.join(" · ")}
            </p>
          )}
          <p className="mt-4 text-base text-muted-foreground">{p.shortDesc}</p>
          <div className="mt-5 h-px w-12 bg-border" />

          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Desde</span>
            <span className="tabular text-3xl font-extrabold text-foreground">
              ${minPrice.toLocaleString("es-MX")}
            </span>
            <span className="text-sm text-muted-foreground">MXN/vial</span>
          </div>

          <div className="mt-6">
            <ConcentrationVolumePicker product={p} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {[
              { i: ShieldCheck, t: "Pureza ≥99%" },
              { i: Beaker, t: "COA disponible" },
              { i: Snowflake, t: "2-8°C" },
              { i: Truck, t: "Envío 10-20 días" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2">
                <Icon className="h-3.5 w-3.5 text-primary" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-muted/40 py-14">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
              Pricing
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Tabla de packs</h2>
            <p className="mt-2 text-muted-foreground">A más volumen, mejor precio por vial.</p>
          </div>
          <div className="mt-8">
            <PricingTiers basePricePerVial={minPrice} productName={p.name} />
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Mecanismo de acción</h2>
          <p className="mt-3 text-muted-foreground">{p.mechanism}</p>
          <h2 className="mt-8 font-display text-2xl font-extrabold tracking-tight">Dosificación (investigación)</h2>
          <p className="mt-3 text-muted-foreground">{p.dosing}</p>
          <p className="mt-3 text-xs italic text-muted-foreground">
            Información exclusivamente educacional para uso de investigación. No constituye asesoría médica.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Almacenamiento</h2>
          <p className="mt-3 text-muted-foreground">{p.storage}</p>
          <h2 className="mt-8 font-display text-2xl font-extrabold tracking-tight">Pureza y análisis</h2>
          <p className="mt-3 text-muted-foreground">
            Cada lote viene con Certificado de Análisis (COA) por HPLC y espectrometría de masas. Solicítalo por WhatsApp al hacer tu pedido.
          </p>
        </div>
      </section>

      {p.longDesc && (
        <section className="bg-muted/40 py-14">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">Sobre {p.name}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.longDesc}</p>
          </div>
        </section>
      )}

      {p.faqs.length > 0 && (
        <section className="container mx-auto max-w-3xl px-4 py-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Preguntas sobre {p.name}</h2>
          <div className="mt-6 rounded-2xl border border-border bg-card p-2 md:p-4 shadow-soft">
            <FAQAccordion items={p.faqs} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container mx-auto px-4 pb-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Productos relacionados</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rp) => <ProductCard key={rp.slug} p={rp} />)}
          </div>
        </section>
      )}
    </>
  );
}
