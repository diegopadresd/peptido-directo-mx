import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Beaker, Users, Package, CreditCard, Home as HomeIcon, Check, MessageCircle, TrendingUp } from "lucide-react";
import { buildHead, organizationJsonLd, faqJsonLd } from "@/lib/seo";
import { products } from "@/data/products";
import { homeFaqs } from "@/data/faqs";
import { testimonials } from "@/data/testimonials";
import { ProductCard } from "@/components/site/ProductCard";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/whatsapp";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    buildHead({
      title: "Péptidos Mayoreo - Distribuidor Directo de Fábrica en México",
      description:
        "Compra péptidos al mayoreo en México con 50% de descuento. Mínimo 10 viales, envío directo desde China. BPC-157, semaglutida, tirzepatida y más.",
      canonical: "/",
      keywords: ["péptidos mayoreo", "peptidos al por mayor mexico", "distribuidor de péptidos méxico", "comprar péptidos mayoreo"],
      jsonLd: [organizationJsonLd(), faqJsonLd(homeFaqs)],
    }),
  component: Home,
});

function Home() {
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 6);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img
          src={heroBg}
          alt=""
          aria-hidden
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/70" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <span className="h-2 w-2 rounded-full bg-success" /> Catálogo activo · Envíos a todo México
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Péptidos al Mayoreo. <br />
              <span className="text-accent">Directo de Fábrica.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
              Del laboratorio en China directo a tu puerta. Compra mínima de 10 viales con 50% de descuento.
              Sin intermediarios, sin markup, sin BS.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent/90">
                <Link to="/productos">Ver Catálogo Mayoreo <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <a href={buildWaLink("Hola, quiero hablar con un asesor sobre el catálogo de mayoreo.")} target="_blank" rel="noopener">
                  <MessageCircle className="mr-1.5 h-4 w-4" /> Hablar con un Asesor
                </a>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Truck, label: "Envío 15-25 días" },
                { icon: CreditCard, label: "Pago en MXN" },
                { icon: ShieldCheck, label: "Pureza ≥99%" },
                { icon: Users, label: "+500 clientes" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                  <b.icon className="h-4 w-4 text-accent" /> {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">¿Cómo Funciona?</h2>
            <p className="mt-3 text-lg text-muted-foreground">3 pasos. Sin pendejadas. Sin contratos.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Package, n: "01", t: "Eliges tus péptidos", d: "Mínimo 10 viales totales. Mezcla libre entre cualquier producto del catálogo." },
              { icon: CreditCard, n: "02", t: "Pagas en MXN", d: "Transferencia SPEI, OXXO o USDT. Pago 100% en pesos mexicanos." },
              { icon: HomeIcon, n: "03", t: "Recibes en casa", d: "Envío directo desde el laboratorio en China a tu dirección. 15-25 días." },
            ].map((s) => (
              <div key={s.n} className="rounded-lg border border-border bg-card p-8 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <s.icon className="h-10 w-10 text-accent" />
                  <span className="font-display text-3xl font-bold text-muted-foreground/30">{s.n}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Por Qué Mayoreo Te Sale Mejor</h2>
            <p className="mt-3 text-lg text-muted-foreground">Comparativa real, sin maquillaje.</p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-4 text-sm font-semibold">Concepto</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">Retail (1 vial)</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">Farmacia gris</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-success">Mayoreo (10+)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Precio por vial BPC-157", "$650 MXN", "$420 MXN", "$280 MXN"],
                  ["Tiempo de entrega", "Inmediato", "3-7 días", "15-25 días"],
                  ["Pureza certificada", "Variable", "Variable", "≥99% HPLC"],
                  ["Soporte WhatsApp", "No", "Limitado", "Sí, prioritario"],
                  ["Reposición si aduana", "No", "No", "Sí (1 vez)"],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-sm font-medium">{row[0]}</td>
                    <td className="px-4 py-3 text-center text-sm tabular text-muted-foreground">{row[1]}</td>
                    <td className="px-4 py-3 text-center text-sm tabular text-muted-foreground">{row[2]}</td>
                    <td className="px-4 py-3 text-center text-sm tabular font-semibold text-success">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Más Vendidos</h2>
              <p className="mt-2 text-muted-foreground">Los productos que mueven nuestros distribuidores.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/productos">Ver catálogo completo <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bestSellers.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      {/* Empieza tu negocio */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                <TrendingUp className="h-3.5 w-3.5" /> Programa Distribuidor
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
                Convierte $5,000 MXN <br /> en <span className="text-accent">$15,000</span>. Cada Mes.
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Sin inventario propio, sin permisos complicados. Márgenes de 200-300%. Te damos catálogo, fotos y soporte.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Precios escalonados desde 50 viales",
                  "Catálogo completo con fotos profesionales",
                  "Descripciones listas para copy-paste",
                  "Soporte WhatsApp prioritario",
                  "Sin contratos ni exclusividad",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent/90">
                  <Link to="/empezar-negocio">Ver Programa Distribuidor <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-8 backdrop-blur">
              <h3 className="font-display text-xl font-bold">Calculadora rápida</h3>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-primary-foreground/10 pb-3">
                  <span>Inversión inicial</span>
                  <span className="tabular font-bold text-accent">$5,000 MXN</span>
                </div>
                <div className="flex justify-between border-b border-primary-foreground/10 pb-3">
                  <span>~17 viales BPC-157 a precio mayoreo</span>
                  <span className="tabular">~$280/vial</span>
                </div>
                <div className="flex justify-between border-b border-primary-foreground/10 pb-3">
                  <span>Reventa a $900 MXN/vial</span>
                  <span className="tabular font-bold text-success">$15,300 MXN</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-semibold">Ganancia mensual</span>
                  <span className="tabular text-2xl font-bold text-accent">$10,300</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Distribuidores Activos</h2>
            <p className="mt-3 text-muted-foreground">Lo que dicen quienes ya están moviendo producto.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-lg border border-border bg-card p-6">
                <p className="text-base text-foreground">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Preguntas Frecuentes</h2>
          <div className="mt-10 rounded-lg border border-border bg-card p-2 md:p-4">
            <FAQAccordion items={homeFaqs} />
          </div>
          <div className="mt-6 text-center">
            <Link to="/preguntas-frecuentes" className="text-sm font-semibold text-primary hover:text-accent">
              Ver todas las preguntas →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-10 text-center text-primary-foreground md:p-16">
            <Beaker className="mx-auto h-12 w-12 text-accent" />
            <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">¿Listo para tu primer pedido?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
              Mínimo 10 viales. Mezcla libre. Cotización inmediata por WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
                <a href={buildWaLink("Hola, quiero hacer mi primer pedido al mayoreo. ¿Me ayudas con la cotización?")} target="_blank" rel="noopener">
                  <MessageCircle className="mr-1.5 h-4 w-4" /> Cotizar por WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/productos">Ver catálogo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
