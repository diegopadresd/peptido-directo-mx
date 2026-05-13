import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Beaker, Users, Package, CreditCard, Home as HomeIcon, Check, MessageCircle, TrendingUp, Sparkles } from "lucide-react";
import { buildHead, organizationJsonLd, faqJsonLd } from "@/lib/seo";
import { products } from "@/data/products";
import { homeFaqs } from "@/data/faqs";
import { testimonials } from "@/data/testimonials";
import { ProductCard } from "@/components/site/ProductCard";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () =>
    buildHead({
      title: "Péptidos Mayoreo - Distribuidor Directo de Fábrica en México",
      description:
        "Compra péptidos al mayoreo en México con 50% de descuento. Mínimo 10 viales por compuesto, pago Mercado Pago, envío 10-20 días. BPC-157, semaglutida, tirzepatida y más.",
      canonical: "/",
      keywords: ["péptidos mayoreo", "peptidos al por mayor mexico", "distribuidor de péptidos méxico", "comprar péptidos mayoreo"],
      jsonLd: [organizationJsonLd(), faqJsonLd(homeFaqs)],
    }),
  component: Home,
});

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}

function Home() {
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 6);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="container relative mx-auto px-4 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <Pill>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Catálogo activo · Envíos 10-20 días a todo México
            </Pill>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-7xl">
              Péptidos al mayoreo. <br />
              <span className="text-primary">Directo de fábrica.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              Cada vez que alguien busca péptidos, le compran al primero que aparece. Si no eres tú, le estás regalando ventas a tu competencia. Nosotros te lo resolvemos en minutos.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-primary px-6 text-primary-foreground shadow-card hover:bg-primary/90">
                <Link to="/productos">Ver catálogo <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-6 text-foreground hover:bg-accent">
                <Link to="/como-funciona">▶ Cómo funciona</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>★★★★★</span>
              <span>+500 distribuidores activos en México</span>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Truck, label: "Envío 10-20 días" },
              { icon: CreditCard, label: "Mercado Pago" },
              { icon: ShieldCheck, label: "Pureza ≥99%" },
              { icon: Users, label: "+500 clientes" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft">
                <b.icon className="h-4 w-4 text-primary" /> <span className="font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Pill><Sparkles className="h-3 w-3" /> Cómo funciona</Pill>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">3 pasos. Sin rodeos.</h2>
            <p className="mt-3 text-lg text-muted-foreground">Sin contratos, sin permisos complicados, sin BS.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Package, n: "01", t: "Eliges tu compuesto", d: "Mínimo 10 viales del mismo péptido y dosis. Cada pedido = 1 compuesto." },
              { icon: CreditCard, n: "02", t: "Pagas con Mercado Pago", d: "Tarjeta, SPEI o efectivo en OXXO. Todo en MXN, recibo formal." },
              { icon: HomeIcon, n: "03", t: "Recibes en casa", d: "Envío directo desde el laboratorio en China a tu puerta. 10-20 días." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-7 shadow-soft transition hover:border-primary/30 hover:shadow-card">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-primary"><s.icon className="h-5 w-5" /></span>
                  <span className="font-display text-3xl font-extrabold text-muted-foreground/30">{s.n}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-extrabold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Pill>Comparativa</Pill>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">Por qué mayoreo te sale mejor</h2>
            <p className="mt-3 text-lg text-muted-foreground">Datos reales, sin maquillaje.</p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold">Concepto</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">Retail (1 vial)</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">Farmacia gris</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold text-primary">Mayoreo (10+)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Precio por vial BPC-157 5mg", "$650 MXN", "$520 MXN", "$375 MXN"],
                  ["Tiempo de entrega", "Inmediato", "3-7 días", "10-20 días"],
                  ["Pureza certificada", "Variable", "Variable", "≥99% HPLC"],
                  ["Soporte WhatsApp", "No", "Limitado", "Sí, prioritario"],
                  ["Reposición si aduana", "No", "No", "Sí (1 vez)"],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4 text-sm font-medium">{row[0]}</td>
                    <td className="px-5 py-4 text-center text-sm tabular text-muted-foreground">{row[1]}</td>
                    <td className="px-5 py-4 text-center text-sm tabular text-muted-foreground">{row[2]}</td>
                    <td className="px-5 py-4 text-center text-sm tabular font-bold text-primary">{row[3]}</td>
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
              <Pill>Catálogo</Pill>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">Más vendidos</h2>
              <p className="mt-2 text-muted-foreground">Lo que están moviendo nuestros distribuidores.</p>
            </div>
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/productos">Ver catálogo completo <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bestSellers.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      {/* Distribuidor */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Pill><TrendingUp className="h-3 w-3" /> Programa Distribuidor</Pill>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                Convierte $11,250 MXN <br /> en <span className="text-primary">$27,000</span>. Cada mes.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Sin inventario propio, sin permisos complicados. Márgenes de 200-300%. Te damos catálogo, fotos y soporte.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Precios escalonados por pack (10 / 20 / 30 viales)",
                  "Catálogo completo con fotos profesionales",
                  "Descripciones listas para copy-paste",
                  "Soporte WhatsApp prioritario",
                  "Sin contratos ni exclusividad",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild size="lg" className="h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/empezar-negocio">Ver programa distribuidor <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
              <h3 className="font-display text-xl font-extrabold tracking-tight">Calculadora rápida</h3>
              <p className="mt-1 text-xs text-muted-foreground">Pack 30 viales BPC-157 5 mg · precio real de catálogo</p>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">Inversión inicial</span>
                  <span className="tabular font-bold text-foreground">$11,250 MXN</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">30 viales BPC-157 5 mg (pack mayoreo)</span>
                  <span className="tabular text-foreground">$375/vial</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">Reventa a $900 MXN/vial</span>
                  <span className="tabular font-bold text-foreground">$27,000 MXN</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-semibold">Ganancia mensual</span>
                  <span className="tabular text-3xl font-extrabold text-primary">$15,750</span>
                </div>
                <p className="pt-1 text-[11px] text-muted-foreground">Margen 140% · números reales del catálogo, no proyecciones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Pill>Casos reales</Pill>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">Distribuidores activos</h2>
            <p className="mt-3 text-muted-foreground">Lo que dicen quienes ya están moviendo producto.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <p className="text-base text-foreground">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-bold text-primary">
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
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center">
            <Pill>Dudas frecuentes</Pill>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">Preguntas frecuentes</h2>
          </div>
          <div className="mt-10 rounded-2xl border border-border bg-card p-2 md:p-4 shadow-soft">
            <FAQAccordion items={homeFaqs} />
          </div>
          <div className="mt-6 text-center">
            <Link to="/preguntas-frecuentes" className="text-sm font-semibold text-primary hover:underline">
              Ver todas las preguntas →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-card md:p-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: "var(--gradient-hero)" }}
              aria-hidden
            />
            <div className="relative">
              <Beaker className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">¿Listo para tu primer pedido?</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Pack mínimo de 10 viales del mismo compuesto. Cotización inmediata por WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/productos">Ver catálogo <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 rounded-full text-foreground hover:bg-accent">
                  <a href={buildWaLink("Hola, quiero hacer mi primer pedido al mayoreo. ¿Me ayudas con la cotización?")} target="_blank" rel="noopener">
                    <MessageCircle className="mr-1.5 h-4 w-4" /> Cotizar por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
