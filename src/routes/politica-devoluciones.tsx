import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, AlertTriangle, Package, CheckCircle2, Clock, HelpCircle } from "lucide-react";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/politica-devoluciones")({
  head: () =>
    buildHead({
      title: "Política de Devoluciones - Péptidos Mayoreo",
      description: "Conoce las condiciones de devolución, reembolso y garantía para pedidos al mayoreo de péptidos en México. Productos de investigación.",
      canonical: "/politica-devoluciones",
      keywords: ["política devoluciones péptidos", "reembolso mayoreo méxico", "garantía péptidos mayoreo"],
      jsonLd: breadcrumbJsonLd([
        { name: "Inicio", url: "/" },
        { name: "Política de devoluciones", url: "/politica-devoluciones" },
      ]),
    }),
  component: PoliticaDevoluciones,
});

function PoliticaDevoluciones() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Política de Devoluciones</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Condiciones claras para devoluciones, reembolsos y garantía de entrega en pedidos al mayoreo.
      </p>

      <div className="mt-12 space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">No aplican devoluciones por cambio de opinión</h2>
              <p className="mt-1 text-muted-foreground">
                Por tratarse de productos de investigación y biológicos sensibles, no aceptamos devoluciones por cambio de opinión o por pedidos incorrectos del cliente. Verifica bien tu lista antes de confirmar el pago.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Producto dañado o equivocado</h2>
              <p className="mt-1 text-muted-foreground">
                Si recibes productos dañados, con sellos rotos o diferentes a tu pedido confirmado, contáctanos por WhatsApp dentro de las 24 horas siguientes a la recepción. Envía fotos del estado del empaque y del producto. Evaluaremos el caso y te daremos las opciones de reposición o reembolso parcial/total según corresponda.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Paquete no entregado o extraviado</h2>
              <p className="mt-1 text-muted-foreground">
                Si el paquete se extravía en tránsito y la paquetería confirma la pérdida, te reponemos el pedido completo sin costo adicional. Si ya no deseas la reposición, podemos procesar un reembolso completo al método de pago original.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Tiempos de reembolso</h2>
              <p className="mt-1 text-muted-foreground">
                Los reembolsos aprobados se procesan en un plazo de 5 a 10 días hábiles. El tiempo de reflejo en tu cuenta depende de tu banco o de Mercado Pago. Transferencias SPEI suelen ser más rápidas; tarjetas de crédito pueden tardar hasta un ciclo de facturación.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Requisitos para procesar una reclamación</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Reportar dentro de las 24 horas posteriores a la recepción.</li>
                <li>Adjuntar fotos del empaque y del producto.</li>
                <li>Contar con el número de guía y el comprobante de pago.</li>
                <li>El producto no debe haber sido manipulado más allá de la inspección inicial.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">¿Dudas sobre tu pedido?</h2>
              <p className="mt-1 text-muted-foreground">
                Si tienes alguna incidencia con tu entrega o necesitas aclarar algo antes de comprar, escríbenos por WhatsApp. Respondemos de lunes a sábado de 9:00 a 19:00 CDMX.
              </p>
              <div className="mt-4">
                <Link
                  to="/contacto"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Ir a contacto →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
