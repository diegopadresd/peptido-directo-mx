import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MessageCircle, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/empezar-negocio")({
  head: () =>
    buildHead({
      title: "Empieza Tu Propio Negocio de Péptidos en México",
      description: "Convierte $5,000 MXN en $15,000+ al mes revendiendo péptidos. Sin inventario, sin permisos. Te damos catálogo, fotos y soporte. Empieza hoy.",
      canonical: "/empezar-negocio",
      keywords: ["como empezar un negocio de péptidos", "revender péptidos", "negocio de péptidos méxico"],
      jsonLd: breadcrumbJsonLd([{ name: "Inicio", url: "/" }, { name: "Empezar negocio", url: "/empezar-negocio" }]),
    }),
  component: Empezar,
});

function Empezar() {
  const [vials, setVials] = useState(20);
  const [salePrice, setSalePrice] = useState(900);
  const cost = vials * 280;
  const revenue = vials * salePrice;
  const profit = revenue - cost;

  return (
    <>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <TrendingUp className="h-3.5 w-3.5" /> Programa Distribuidor
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold md:text-6xl">
            Empieza Tu Propio Negocio <br /> de <span className="text-accent">Péptidos en México</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/80">
            Mercado en crecimiento explosivo. Márgenes brutales. Demanda alta. Cero inventario propio.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">¿Por Qué Péptidos?</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: TrendingUp, t: "Mercado en explosión", d: "Búsquedas de péptidos crecieron 340% en México en los últimos 24 meses." },
              { icon: DollarSign, t: "Márgenes 200-300%", d: "Costo $280, reventa $900. Pocos productos físicos te dan estos márgenes." },
              { icon: Users, t: "Demanda recurrente", d: "Tus clientes recompran cada 30-60 días. Ingreso mensual predecible." },
            ].map((b) => (
              <div key={b.t} className="rounded-lg border border-border bg-card p-6">
                <b.icon className="h-8 w-8 text-accent" />
                <h3 className="mt-3 font-display text-lg font-bold">{b.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Cuánto Puedes Ganar</h2>
          <p className="mt-3 text-center text-muted-foreground">Calcula tu ganancia mensual con BPC-157 como ejemplo.</p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 rounded-xl border border-border bg-card p-8 md:grid-cols-2">
            <div>
              <label htmlFor="calc-vials" className="text-sm font-semibold">Viales que vendes al mes</label>
              <input
                id="calc-vials"
                type="range"
                min={10}
                max={200}
                step={5}
                value={vials}
                onChange={(e) => setVials(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
              <p className="mt-1 tabular text-2xl font-bold text-primary">{vials} viales</p>
            </div>
            <div>
              <label htmlFor="calc-price" className="text-sm font-semibold">Precio de reventa por vial (MXN)</label>
              <input
                id="calc-price"
                type="range"
                min={500}
                max={1500}
                step={50}
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
              <p className="mt-1 tabular text-2xl font-bold text-primary">${salePrice} MXN</p>
            </div>
            <div className="md:col-span-2">
              <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Inversión</p>
                  <p className="tabular text-xl font-bold">${cost.toLocaleString("es-MX")}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Ingreso</p>
                  <p className="tabular text-xl font-bold">${revenue.toLocaleString("es-MX")}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-success">Ganancia mensual</p>
                  <p className="tabular text-3xl font-extrabold text-success">${profit.toLocaleString("es-MX")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Qué Te Damos</h2>
          <ul className="mx-auto mt-10 grid max-w-2xl gap-3">
            {[
              "Precios de distribuidor (mejores que mayoreo regular si compras 50+)",
              "Catálogo completo con fotos profesionales listas para usar",
              "Descripciones técnicas listas para copy-paste en tu tienda",
              "Soporte WhatsApp prioritario (respuesta < 1 hora hábil)",
              "Sin contratos, sin permisos exclusivos, sin minimo mensual",
              "Reposición garantizada en caso de incautación aduanera",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-md bg-card p-4">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <Package className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">3 Pasos Para Empezar</h2>
          <ol className="mx-auto mt-8 grid max-w-2xl gap-4 text-left md:grid-cols-3">
            <li className="rounded-lg bg-primary-foreground/5 p-5">
              <span className="font-display text-3xl font-extrabold text-accent">01</span>
              <p className="mt-2 font-semibold">Escríbenos por WhatsApp</p>
              <p className="text-sm text-primary-foreground/70">Te enviamos catálogo distribuidor + lista de precios.</p>
            </li>
            <li className="rounded-lg bg-primary-foreground/5 p-5">
              <span className="font-display text-3xl font-extrabold text-accent">02</span>
              <p className="mt-2 font-semibold">Haces tu primer pedido</p>
              <p className="text-sm text-primary-foreground/70">Mínimo 10 viales, paga en MXN.</p>
            </li>
            <li className="rounded-lg bg-primary-foreground/5 p-5">
              <span className="font-display text-3xl font-extrabold text-accent">03</span>
              <p className="mt-2 font-semibold">Empiezas a vender</p>
              <p className="text-sm text-primary-foreground/70">Recibes en 10-20 días y revendes con tu margen.</p>
            </li>
          </ol>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
              <a href={buildWaLink("Hola, quiero info del programa distribuidor.")} target="_blank" rel="noopener">
                <MessageCircle className="mr-1.5 h-4 w-4" /> Quiero info del programa
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/distribuidor">Ver precios distribuidor</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
