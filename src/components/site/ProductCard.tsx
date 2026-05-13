import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { minBasePrice } from "@/data/products";
import { ArrowUpRight } from "lucide-react";

export function ProductCard({ p }: { p: Product }) {
  const minPrice = minBasePrice(p);
  const doses = p.variants.map((v) => v.dose).join(" · ");
  return (
    <Link
      to="/productos/$slug"
      params={{ slug: p.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={p.image}
          alt={`${p.name} vial mayoreo México`}
          width={800}
          height={800}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-extrabold tracking-tight text-foreground">{p.name}</h3>
          <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition group-hover:text-primary" />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{doses}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.shortDesc}</p>
        <div className="mt-auto pt-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Desde</p>
          <p className="tabular text-2xl font-extrabold text-foreground">
            ${minPrice.toLocaleString("es-MX")}
            <span className="text-sm font-normal text-muted-foreground"> MXN/vial</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
