import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, MapPin, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { getCity, cities } from "@/data/cities";
import { products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { Button } from "@/components/ui/button";
import { buildHead, breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/peptidos/$ciudad")({
  loader: ({ params }) => {
    const city = getCity(params.ciudad);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const c = loaderData.city;
    return buildHead({
      title: `Péptidos al Mayoreo en ${c.name} | Envío Directo a ${c.state}`,
      description: `Compra péptidos al mayoreo en ${c.name}, ${c.state}. Mínimo 10 viales, descuentos por volumen, pago seguro eCartPay. Envío en ${c.deliveryDays} hábiles.`,
      canonical: `/peptidos/${c.slug}`,
      keywords: [
        `péptidos mayoreo ${c.name}`,
        `distribuidor péptidos ${c.name}`,
        `comprar péptidos ${c.name}`,
        `péptidos ${c.state}`,
      ],
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Ciudades", url: "/" },
          { name: c.name, url: `/peptidos/${c.slug}` },
        ]),
        localBusinessJsonLd({ city: c.name, state: c.state, url: `/peptidos/${c.slug}` }),
        faqJsonLd(c.faqs),
      ],
    });
  },
  component: CiudadPage,
  notFoundComponent: () => (
    <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Ciudad no disponible</h1>
      <p className="mt-3 text-muted-foreground">Aún no servimos esta ciudad o el enlace está mal escrito.</p>
      <Link to="/productos" className="mt-6 inline-block text-primary underline">Ver catálogo</Link>
    </div>
  ),
});

function CiudadPage() {
  const { city } = Route.useLoaderData();
  const topProducts = products.filter((p) => p.inStock).slice(0, 6);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Péptidos en {city.name}</span>
      </nav>

      <header className="mt-6">
        <p className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <MapPin className="h-3 w-3" /> {city.state}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">
          Péptidos al Mayoreo en {city.name}, {city.state}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{city.intro}</p>
      </header>

      <section className="mt-10 grid gap-4 rounded-xl border border-border bg-card p-6 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Tiempo de entrega</p>
            <p className="text-sm text-muted-foreground">{city.deliveryDays} hábiles a {city.name}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Garantía de entrega</p>
            <p className="text-sm text-muted-foreground">Reposición sin costo si la paquetería extravía el paquete.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MessageCircle className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Pago eCartPay</p>
            <p className="text-sm text-muted-foreground">Tarjeta, SPEI u OXXO. Comprobante automático.</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          Por qué distribuidores de {city.name} compran aquí
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">{city.whyHere}</p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          Top péptidos al mayoreo en {city.name}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topProducts.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
        <div className="mt-6">
          <Link to="/productos" className="text-sm font-semibold text-primary hover:underline">
            Ver catálogo completo de péptidos al mayoreo <ArrowRight className="inline h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          Clientes en {city.name}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {city.testimonials.map((t: { name: string; role: string; quote: string }) => (
            <figure key={t.name} className="rounded-xl border border-border bg-card p-6">
              <blockquote className="text-sm text-foreground">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-3 text-xs text-muted-foreground">
                <strong className="text-foreground">{t.name}</strong> — {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          Preguntas frecuentes — envíos a {city.name}
        </h2>
        <div className="mt-6">
          <FAQAccordion items={city.faqs} />
        </div>
      </section>

      <section className="mt-12 rounded-xl bg-primary p-8 text-primary-foreground md:p-10">
        <h2 className="font-display text-2xl font-bold">¿Listo para tu primer pedido en {city.name}?</h2>
        <p className="mt-2 text-primary-foreground/80">Cotización por WhatsApp en menos de 1 hora hábil.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
            <a href={buildWaLink(`Hola, quiero cotizar péptidos al mayoreo. Envío a ${city.name}.`)} target="_blank" rel="noopener">
              <MessageCircle className="mr-1.5 h-4 w-4" /> Cotizar por WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/productos">Ver catálogo</Link>
          </Button>
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Otras ciudades que servimos</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {cities.filter((c) => c.slug !== city.slug).map((c) => (
            <li key={c.slug}>
              <Link
                to="/peptidos/$ciudad"
                params={{ ciudad: c.slug }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}