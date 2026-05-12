import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, ShieldCheck, Beaker, Snowflake } from "lucide-react";
import { getProduct, products } from "@/data/products";
import { categories } from "@/data/categories";
import { PricingTiers } from "@/components/site/PricingTiers";
import { ProductCard } from "@/components/site/ProductCard";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { Button } from "@/components/ui/button";
import { buildHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { buildWaLink, SITE_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/productos/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const p = loaderData.product;
    const minPrice = p.tiers[p.tiers.length - 1].pricePerVial;
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
        lowPrice: minPrice,
        highPrice: p.tiers[0].pricePerVial,
        offerCount: p.tiers.length,
        availability: "https://schema.org/InStock",
      },
    };
    return buildHead({
      title: `${p.name} Mayoreo - Precio Distribuidor México`,
      description: `${p.name} ${p.mgPerVial} al mayoreo desde $${minPrice} MXN/vial. Mínimo 10 viales. Pureza ≥99%. Envío directo a todo México.`,
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
  const minPrice = p.tiers[p.tiers.length - 1].pricePerVial;
  const related = p.related.map((s: string) => getProduct(s)).filter(Boolean) as typeof products;
  const wa = buildWaLink(
    `Hola, quiero cotizar ${p.name} (${p.mgPerVial}). ¿Me das el precio actualizado al mayoreo?`,
  );

  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <Link to="/productos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al catálogo
        </Link>
      </div>

      <div className="container mx-auto grid gap-10 px-4 py-8 lg:grid-cols-2 lg:py-12">
        <div className="overflow-hidden rounded-lg border border-border bg-secondary">
          <img
            src={p.image}
            alt={`${p.name} ${p.mgPerVial} vial mayoreo México`}
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          {cat && (
            <Link to="/productos" className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline">
              {cat.name}
            </Link>
          )}
          <h1 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
            {p.name} Mayoreo - Precio Distribuidor México
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {p.mgPerVial} por vial · Pureza ≥99% · Liofilizado
          </p>
          <p className="mt-4 text-base text-foreground">{p.longDesc}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-sm text-muted-foreground">Desde</span>
            <span className="tabular text-4xl font-extrabold text-primary">
              ${minPrice.toLocaleString("es-MX")} MXN
            </span>
            <span className="text-sm text-muted-foreground">/vial</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
              <a href={wa} target="_blank" rel="noopener">
                <MessageCircle className="mr-1.5 h-4 w-4" /> Pedir Cotización por WhatsApp
              </a>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 rounded-md border border-border bg-card p-3">
              <ShieldCheck className="h-4 w-4 text-accent" /> Pureza ≥99% HPLC
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-card p-3">
              <Beaker className="h-4 w-4 text-accent" /> COA disponible
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-card p-3">
              <Snowflake className="h-4 w-4 text-accent" /> Refrigeración 2-8°C
            </div>
          </div>
        </div>
      </div>

      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Tabla de Precios Escalonada</h2>
          <p className="mt-2 text-muted-foreground">A más volumen, mejor precio por vial.</p>
          <div className="mt-6">
            <PricingTiers tiers={p.tiers} productName={p.name} />
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold">Mecanismo de Acción</h2>
          <p className="mt-3 text-muted-foreground">{p.mechanism}</p>
          <h2 className="mt-8 font-display text-2xl font-bold">Dosificación (investigación)</h2>
          <p className="mt-3 text-muted-foreground">{p.dosing}</p>
          <p className="mt-3 text-xs italic text-muted-foreground">
            Información exclusivamente educacional para uso de investigación. No constituye asesoría médica.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Almacenamiento</h2>
          <p className="mt-3 text-muted-foreground">{p.storage}</p>
          <h2 className="mt-8 font-display text-2xl font-bold">Pureza y Análisis</h2>
          <p className="mt-3 text-muted-foreground">
            Cada lote viene con Certificado de Análisis (COA) por HPLC y espectrometría de masas. Solicítalo por WhatsApp al hacer tu pedido.
          </p>
        </div>
      </section>

      {p.faqs.length > 0 && (
        <section className="bg-secondary py-12">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Preguntas sobre {p.name}</h2>
            <div className="mt-6 rounded-lg border border-border bg-card p-2 md:p-4">
              <FAQAccordion items={p.faqs} />
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Productos relacionados</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rp) => <ProductCard key={rp.slug} p={rp} />)}
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-background p-3 shadow-lg md:hidden">
        <Button asChild className="h-12 w-full bg-success text-success-foreground hover:bg-success/90">
          <a href={wa} target="_blank" rel="noopener">
            <MessageCircle className="mr-1.5 h-4 w-4" /> Cotizar {p.name} por WhatsApp
          </a>
        </Button>
      </div>
    </>
  );
}
