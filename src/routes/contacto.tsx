import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, Clock, MapPin } from "lucide-react";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contacto")({
  head: () =>
    buildHead({
      title: "Contacto - Péptidos Mayoreo México",
      description: "Contáctanos por WhatsApp para cotización inmediata de péptidos al mayoreo. Atención en horario México.",
      canonical: "/contacto",
      jsonLd: breadcrumbJsonLd([{ name: "Inicio", url: "/" }, { name: "Contacto", url: "/contacto" }]),
    }),
  component: Contacto,
});

function Contacto() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Contacto</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        WhatsApp es el canal más rápido. Te respondemos en menos de 1 hora hábil.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-8">
          <MessageCircle className="h-10 w-10 text-success" />
          <h2 className="mt-4 font-display text-2xl font-bold">WhatsApp</h2>
          <p className="mt-2 text-muted-foreground">Cotización, soporte, asesoría. El canal principal.</p>
          <Button asChild size="lg" className="mt-6 w-full bg-success text-success-foreground hover:bg-success/90">
            <a href={buildWaLink("Hola, vengo de la página de contacto.")} target="_blank" rel="noopener">
              <MessageCircle className="mr-1.5 h-4 w-4" /> Abrir WhatsApp
            </a>
          </Button>
        </div>
        <div className="rounded-lg border border-border bg-card p-8">
          <Mail className="h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold">Email</h2>
          <p className="mt-2 text-muted-foreground">Para pedidos B2B grandes o documentación.</p>
          <a href="mailto:hola@peptidosmayoreo.com" className="mt-4 inline-block text-base font-semibold text-primary hover:text-accent">
            hola@peptidosmayoreo.com
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-md border border-border bg-secondary p-5">
          <Clock className="mt-0.5 h-5 w-5 text-accent" />
          <div>
            <p className="font-semibold">Horario de atención</p>
            <p className="text-sm text-muted-foreground">Lun–Sáb · 9:00–19:00 hora CDMX</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-md border border-border bg-secondary p-5">
          <MapPin className="mt-0.5 h-5 w-5 text-accent" />
          <div>
            <p className="font-semibold">Cobertura</p>
            <p className="text-sm text-muted-foreground">Envío directo a toda la República Mexicana</p>
          </div>
        </div>
      </div>
    </div>
  );
}
