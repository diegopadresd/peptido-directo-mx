import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, minBasePrice } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/site/ProductCard";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/productos/")({
  head: () =>
    buildHead({
      title: "Catálogo Mayoreo - Péptidos al Por Mayor en México",
      description:
        "Catálogo de péptidos al mayoreo en México: BPC-157, semaglutida, tirzepatida, retatrutida, CJC-1295, ipamorelin. Mínimo 10 viales. Pago Mercado Pago.",
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
    list = list.filter((p) => p.inStock);
    list = [...list];
    if (sort === "asc") list.sort((a, b) => minBasePrice(a) - minBasePrice(b));
    if (sort === "desc") list.sort((a, b) => minBasePrice(b) - minBasePrice(a));
    return list;
  }, [cat, sort]);

  const outOfStock = useMemo(
    () =>
      (cat === "todos" ? products : products.filter((p) => p.category === cat))
        .filter((p) => !p.inStock),
    [cat],
  );

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
            aria-label="Ordenar productos"
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

      {outOfStock.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reserva 4-6 semanas</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight md:text-3xl">Próxima reposición</h2>
            </div>
            <span className="text-sm text-muted-foreground">{outOfStock.length} compuestos</span>
          </div>
          <div className="mt-6 grid gap-6 opacity-60 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {outOfStock.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
