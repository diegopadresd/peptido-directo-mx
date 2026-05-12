import { createFileRoute } from "@tanstack/react-router";
import { Check, MessageCircle } from "lucide-react";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/distribuidor")({
  head: () =>
    buildHead({
      title: "Programa Distribuidor - Precios Especiales para Revendedores",
      description: "Precios escalonados de distribuidor para revendedores serios en México. Desde 50 viales con descuentos adicionales. Soporte prioritario.",
      canonical: "/distribuidor",
      keywords: ["distribuidor de péptidos méxico", "proveedor de péptidos méxico", "revender péptidos"],
      jsonLd: breadcrumbJsonLd([{ name: "Inicio", url: "/" }, { name: "Distribuidor", url: "/distribuidor" }]),
    }),
  component: Distribuidor,
});

const tiers = [
  { name: "Mayoreo", min: "10-49 viales", desc: "Acceso al catálogo con precios de mayoreo estándar.", features: ["50% off retail", "Soporte WhatsApp", "Reposición aduana"], cta: "Ver catálogo", price: "Estándar" },
  { name: "Distribuidor", min: "50-199 viales", desc: "Descuentos adicionales y soporte prioritario.", features: ["Precio mayoreo -10%", "Catálogo distribuidor", "Soporte prioritario", "Fotos profesionales"], cta: "Aplicar", price: "−10% extra", highlight: true },
  { name: "Volumen", min: "200+ viales", desc: "Precios personalizados y términos comerciales.", features: ["Precio negociado", "Términos de crédito", "Asesor dedicado", "Branding privado"], cta: "Cotizar", price: "Personalizado" },
];

function Distribuidor() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Programa Distribuidor</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold md:text-5xl">
          Precios Escalonados Para Revendedores Serios
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A más volumen, mejor precio. Sin contratos de exclusividad. Sin minimo mensual obligatorio.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-xl border bg-card p-8 ${t.highlight ? "border-accent shadow-lg ring-2 ring-accent" : "border-border"}`}
          >
            {t.highlight && (
              <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Más popular</span>
            )}
            <h3 className="mt-3 font-display text-2xl font-bold">{t.name}</h3>
            <p className="text-sm text-muted-foreground">{t.min}</p>
            <p className="mt-4 tabular text-3xl font-extrabold text-primary">{t.price}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={buildWaLink(`Hola, quiero info del nivel ${t.name} (${t.min}).`)} target="_blank" rel="noopener">
                <MessageCircle className="mr-1.5 h-4 w-4" /> {t.cta}
              </a>
            </Button>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-lg border border-border bg-secondary p-8 text-center">
        <h2 className="font-display text-2xl font-bold">¿No sabes qué nivel te conviene?</h2>
        <p className="mt-2 text-muted-foreground">Cuéntanos tu caso por WhatsApp y te recomendamos el plan correcto.</p>
        <Button asChild className="mt-5 bg-success text-success-foreground hover:bg-success/90" size="lg">
          <a href={buildWaLink("Hola, quiero asesoría sobre qué nivel de distribuidor me conviene.")} target="_blank" rel="noopener">
            <MessageCircle className="mr-1.5 h-4 w-4" /> Hablar con un asesor
          </a>
        </Button>
      </div>
    </div>
  );
}
