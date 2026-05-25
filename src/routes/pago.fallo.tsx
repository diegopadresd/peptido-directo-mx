import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildHead } from "@/lib/seo";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/pago/fallo")({
  head: () =>
    buildHead({
      title: "Pago no completado - Péptidos Mayoreo",
      description: "Tu pago no se pudo procesar. Intenta de nuevo o contáctanos por WhatsApp.",
      canonical: "/pago/fallo",
      noindex: true,
    }),
  component: PagoFallo,
});

function PagoFallo() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
      <XCircle className="mx-auto h-16 w-16 text-destructive" />
      <h1 className="mt-6 font-display text-4xl font-extrabold">Pago no completado</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Tu pago no se pudo procesar. Puede ser un rechazo del banco, fondos
        insuficientes o un dato incorrecto. Intenta de nuevo o escríbenos para
        coordinar otro método.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link to="/productos">Volver al catálogo</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={buildWaLink("Hola, mi pago en Stripe no se completó. ¿Me ayudan?")} target="_blank" rel="noopener">
            <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
