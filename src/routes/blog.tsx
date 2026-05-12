import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/blog")({
  head: () =>
    buildHead({
      title: "Blog - Guías de Péptidos al Mayoreo en México",
      description: "Artículos, guías y tutoriales sobre el negocio de péptidos al mayoreo en México: cómo empezar, productos, logística y más.",
      canonical: "/blog",
      jsonLd: breadcrumbJsonLd([{ name: "Inicio", url: "/" }, { name: "Blog", url: "/blog" }]),
    }),
  component: Blog,
});

const posts = [
  {
    slug: "como-empezar-negocio-peptidos-mexico",
    title: "Cómo empezar un negocio de péptidos en México en 2025",
    excerpt: "Guía completa para arrancar tu negocio de reventa de péptidos: inversión inicial, productos top, márgenes y errores comunes.",
    date: "2025-04-12",
  },
];

function Blog() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Blog</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Guías prácticas para distribuidores y revendedores de péptidos en México.
      </p>
      <div className="mt-10 space-y-6">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="block rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.date}</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-primary">{p.title}</h2>
            <p className="mt-2 text-muted-foreground">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
