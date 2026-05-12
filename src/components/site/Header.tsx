import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/productos", label: "Productos" },
  { to: "/como-funciona", label: "Cómo funciona" },
  { to: "/empezar-negocio", label: "Empezar negocio" },
  { to: "/distribuidor", label: "Distribuidor" },
  { to: "/preguntas-frecuentes", label: "FAQ" },
  { to: "/blog", label: "Blog" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">PM</span>
          <span className="hidden sm:inline">Péptidos Mayoreo</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden bg-success text-success-foreground hover:bg-success/90 md:inline-flex">
            <a href={buildWaLink("Hola, me interesa información sobre péptidos al mayoreo.")} target="_blank" rel="noopener">
              <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-md hover:bg-muted lg:hidden"
            aria-label="Menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container mx-auto flex flex-col px-4 py-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-foreground/80"
                activeProps={{ className: "text-primary" }}
              >
                {n.label}
              </Link>
            ))}
            <Button asChild className="my-3 bg-success text-success-foreground hover:bg-success/90">
              <a href={buildWaLink("Hola, me interesa información sobre péptidos al mayoreo.")} target="_blank" rel="noopener">
                <MessageCircle className="mr-1.5 h-4 w-4" /> Hablar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
