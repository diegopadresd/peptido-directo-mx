import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, CreditCard, Truck, Home, ShieldCheck, MessageCircle } from "lucide-react";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/como-funciona")({
  head: () =>
    buildHead({
      title: "Cómo Funciona - Mayoreo de Péptidos en México",
      description: "Cotización por WhatsApp, pago seguro con Stripe y envío nacional. Mínimo 10 viales, mezcla libre del catálogo.",
      canonical: "/como-funciona",
      keywords: ["péptidos mayoreo méxico", "como comprar péptidos mayoreo", "mercado pago péptidos"],
      jsonLd: breadcrumbJsonLd([{ name: "Inicio", url: "/" }, { name: "Cómo funciona", url: "/como-funciona" }]),
    }),
  component: ComoFunciona,
});

function ComoFunciona() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Cómo Funciona el Modelo</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Compras al mayoreo con precio por vial, cotización rápida por WhatsApp y pago seguro con Stripe. Envío nacional a todo México.
      </p>

      <div className="mt-12 space-y-6">
        {[
          { icon: Package, t: "1. Eliges productos y cantidad", d: "Mínimo 10 viales totales — puedes mezclar cualquier producto del catálogo. Nos escribes por WhatsApp con tu lista y te confirmamos disponibilidad y precio final en MXN." },
          { icon: CreditCard, t: "2. Pagas con Stripe", d: "Te enviamos un link de pago de Stripe con el monto exacto de tu cotización. Puedes pagar con tarjeta de crédito o débito, SPEI o efectivo en OXXO. Recibes comprobante automático al confirmar el pago." },
          { icon: Truck, t: "3. Preparamos y enviamos tu pedido", d: "Una vez confirmado el pago, preparamos el pedido y lo enviamos por paquetería con número de guía para que rastrees el envío en todo momento." },
          { icon: Home, t: "4. Llega a tu puerta", d: "Entregamos a la dirección que indiques en cualquier estado de México. Tiempos estimados de 3 a 7 días hábiles según ubicación." },
          { icon: ShieldCheck, t: "5. Garantía de entrega", d: "Si tu paquete se extravía con la paquetería, lo reponemos sin costo. Cobertura sujeta a guía con seguimiento activo." },
        ].map((s) => (
          <div key={s.t} className="flex gap-4 rounded-lg border border-border bg-card p-6">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">{s.t}</h2>
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
