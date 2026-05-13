import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { minBasePrice } from "@/data/products";
import { ArrowRight } from "lucide-react";

export function ProductCard({ p }: { p: Product }) {
  const minPrice = minBasePrice(p);
  const doses = p.variants.map((v) => v.dose).join(" · ");
  return (
    <Link
      to="/productos/$slug"
      params={{ slug: p.slug }}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={p.image}
          alt={`${p.name} vial mayoreo México`}
          width={800}
          height={800}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>
        <p className="text-xs text-muted-foreground">{doses}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.shortDesc}</p>
        <div className="mt-auto pt-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Desde</p>
          <p className="tabular text-2xl font-bold text-primary">
            ${minPrice.toLocaleString("es-MX")}
            <span className="text-sm font-normal text-muted-foreground"> MXN/vial</span>
          </p>
          <span className="mt-2 inline-flex items-center text-sm font-semibold text-primary group-hover:text-accent">
            Ver detalle <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
