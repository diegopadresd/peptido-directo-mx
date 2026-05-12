import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, CreditCard, Plane, Home, ShieldCheck, MessageCircle } from "lucide-react";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/como-funciona")({
  head: () =>
    buildHead({
      title: "Cómo Funciona - Modelo de Mayoreo Directo de China",
      description: "Aprende cómo compramos péptidos directo de fábrica en China y los enviamos a tu puerta en México con 50% menos. Pago en MXN, envío 15-25 días.",
      canonical: "/como-funciona",
      keywords: ["péptidos directo de china", "como comprar péptidos mayoreo", "envío péptidos méxico"],
      jsonLd: breadcrumbJsonLd([{ name: "Inicio", url: "/" }, { name: "Cómo funciona", url: "/como-funciona" }]),
    }),
  component: ComoFunciona,
});

function ComoFunciona() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Cómo Funciona el Modelo</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Sin intermediarios, sin almacenes intermedios, sin markup retail. Compras directo del laboratorio que produce y nosotros nos encargamos de la logística.
      </p>

      <div className="mt-12 space-y-6">
        {[
          { icon: Package, t: "1. Eliges productos y cantidad", d: "Mínimo 10 viales totales — puedes mezclar cualquier producto del catálogo. Cotizamos por WhatsApp con precio final en MXN incluyendo envío." },
          { icon: CreditCard, t: "2. Pagas en pesos", d: "Aceptamos transferencia SPEI, depósito en OXXO o USDT (TRC20). Te pasamos los datos al confirmar el pedido. No hay checkout en el sitio porque manejamos cada cotización personalizada." },
          { icon: Plane, t: "3. Sale del laboratorio en China", d: "En menos de 48 horas tu pedido sale del laboratorio empacado discreto. Te enviamos número de rastreo para que sigas el envío en todo momento." },
          { icon: Home, t: "4. Llega a tu puerta en 15-25 días", d: "Envío DDP (Delivered Duty Paid): nosotros nos encargamos de los trámites. Llega a la dirección que indiques en cualquier estado de México." },
          { icon: ShieldCheck, t: "5. Garantía de reposición", d: "En el raro caso de incautación en aduana (>95% éxito histórico), reenviamos sin costo (válido una vez por cliente)." },
        ].map((s) => (
          <div key={s.t} className="flex gap-4 rounded-lg border border-border bg-card p-6">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-1 text-muted-foreground">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-primary p-8 text-primary-foreground md:p-10">
        <h2 className="font-display text-2xl font-bold">¿Listo para empezar?</h2>
        <p className="mt-2 text-primary-foreground/80">Cotización por WhatsApp en menos de 1 hora hábil.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
            <a href={buildWaLink("Hola, quiero hacer mi primera cotización al mayoreo.")} target="_blank" rel="noopener">
              <MessageCircle className="mr-1.5 h-4 w-4" /> Cotizar por WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/productos">Ver catálogo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
