import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildHead } from "@/lib/seo";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/pago/exito")({
  head: () =>
    buildHead({
      title: "Pago confirmado - Péptidos Mayoreo",
      description: "Gracias por tu compra. Te contactamos por WhatsApp para coordinar el envío.",
      canonical: "/pago/exito",
      noindex: true,
    }),
  component: PagoExito,
});

function PagoExito() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
      <h1 className="mt-6 font-display text-4xl font-extrabold">¡Pago confirmado!</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Recibimos tu pago. Te contactamos por WhatsApp en menos de 1 hora hábil
        para confirmar dirección de envío y enviarte el COA del lote.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
          <a href={buildWaLink("Hola, acabo de pagar mi pedido con tarjeta.")} target="_blank" rel="noopener">
            <MessageCircle className="mr-1.5 h-4 w-4" /> Confirmar por WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/productos">Volver al catálogo</Link>
        </Button>
      </div>
    </div>
  );
}
