import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, minBasePrice } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/site/ProductCard";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/productos")({
  head: () =>
    buildHead({
      title: "Catálogo Mayoreo - Péptidos al Por Mayor en México",
      description:
        "Catálogo completo de péptidos al mayoreo en México: BPC-157, semaglutida, tirzepatida, retatrutida, CJC-1295, ipamorelin y más. Mínimo 10 viales. Pago Mercado Pago.",
      canonical: "/productos",
      keywords: ["catálogo péptidos mayoreo", "péptidos al por mayor mexico", "comprar péptidos mayoreo"],
      jsonLd: breadcrumbJsonLd([
        { name: "Inicio", url: "/" },
        { name: "Catálogo", url: "/productos" },
      ]),
    }),
  component: Catalogo,
});

function Catalogo() {
  const [cat, setCat] = useState<string>("todos");
  const [sort, setSort] = useState<"featured" | "asc" | "desc">("featured");

  const filtered = useMemo(() => {
    let list = cat === "todos" ? products : products.filter((p) => p.category === cat);
    list = [...list];
    if (sort === "asc") list.sort((a, b) => minBasePrice(a) - minBasePrice(b));
    if (sort === "desc") list.sort((a, b) => minBasePrice(b) - minBasePrice(a));
    return list;
  }, [cat, sort]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Catálogo</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold md:text-5xl">Péptidos al Mayoreo</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Mínimo 10 viales totales — mezcla libre. Packs de 10 / 20 / 30 con descuento. Pago seguro con Mercado Pago.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setCat("todos")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${cat === "todos" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${cat === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}
          >
            {c.name}
          </button>
        ))}
        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "featured" | "asc" | "desc")}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="featured">Destacados</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">No hay productos en esta categoría aún.</p>
      )}
    </div>
  );
}
