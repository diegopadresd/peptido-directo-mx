import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoFull from "@/assets/peptidos-mayoreo-logo.svg";
import logoMark from "@/assets/peptidos-mayoreo-mark.svg";

const nav = [
  { to: "/productos", label: "Productos" },
  { to: "/como-funciona", label: "Cómo funciona" },
  { to: "/empezar-negocio", label: "Negocio" },
  { to: "/distribuidor", label: "Distribuidor" },
  { to: "/preguntas-frecuentes", label: "FAQ" },
  { to: "/blog", label: "Blog" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center" aria-label="Péptidos Mayoreo - Inicio">
          <img src={logoMark} alt="Péptidos Mayoreo" className="h-9 w-9 sm:hidden" width={36} height={36} />
          <img src={logoFull} alt="Péptidos Mayoreo" className="hidden h-10 w-auto sm:block" height={40} />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden h-9 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90 md:inline-flex">
            <Link to="/productos">
              Comprar ahora <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
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
            <Button asChild className="my-3 h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/productos" onClick={() => setOpen(false)}>
                Comprar ahora <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
