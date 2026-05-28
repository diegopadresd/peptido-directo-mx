import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildHead } from "@/lib/seo";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/pago/pendiente")({
  head: () =>
    buildHead({
      title: "Pago pendiente - Péptidos Mayoreo",
      description: "Tu pago está en revisión. Te confirmamos por WhatsApp en cuanto se acredite.",
      canonical: "/pago/pendiente",
      noindex: true,
    }),
  component: PagoPendiente,
});

function PagoPendiente() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
      <Clock className="mx-auto h-16 w-16 text-primary" />
      <h1 className="mt-6 font-display text-4xl font-extrabold">Pago pendiente</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Tu pago quedó en revisión (común en pagos en efectivo
        u OXXO). En cuanto se acredite te avisamos por WhatsApp y procesamos tu
        envío.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <a href={buildWaLink("Hola, mi pago quedó pendiente.")} target="_blank" rel="noopener">
            <MessageCircle className="mr-1.5 h-4 w-4" /> Avisar por WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/">Inicio</Link>
        </Button>
      </div>
    </div>
  );
}
