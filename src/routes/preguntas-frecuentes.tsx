import { createFileRoute } from "@tanstack/react-router";
import { buildHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { fullFaqs } from "@/data/faqs";
import { FAQAccordion } from "@/components/site/FAQAccordion";

export const Route = createFileRoute("/preguntas-frecuentes")({
  head: () =>
    buildHead({
      title: "Preguntas Frecuentes - Péptidos Mayoreo México",
      description: "Resolvemos las dudas más comunes sobre comprar péptidos al mayoreo en México: legalidad, envío, aduana, pago, garantías y más.",
      canonical: "/preguntas-frecuentes",
      jsonLd: [
        faqJsonLd(fullFaqs),
        breadcrumbJsonLd([{ name: "Inicio", url: "/" }, { name: "FAQ", url: "/preguntas-frecuentes" }]),
      ],
    }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Preguntas Frecuentes</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Todo lo que necesitas saber antes de hacer tu primer pedido.
      </p>
      <div className="mt-10 rounded-lg border border-border bg-card p-2 md:p-4">
        <FAQAccordion items={fullFaqs} />
      </div>
    </div>
  );
}
