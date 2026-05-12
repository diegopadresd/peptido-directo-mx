import { MessageCircle } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";

export function WhatsAppFAB() {
  return (
    <a
      href={buildWaLink("Hola, vengo del sitio web. Me interesa el catálogo de mayoreo.")}
      target="_blank"
      rel="noopener"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-success px-4 py-3 text-success-foreground shadow-lg transition-transform hover:scale-105"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
