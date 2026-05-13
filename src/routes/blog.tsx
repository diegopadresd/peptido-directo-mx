import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";
import { posts } from "@/data/blog";

export const Route = createFileRoute("/blog")({
  head: () =>
    buildHead({
      title: "Blog Péptidos Mayoreo México — Guías para distribuidores",
      description:
        "Guías y tutoriales para distribuidores de péptidos en México: semaglutida, tirzepatida, retatrutida, BPC-157, GHK-Cu, precios y logística.",
      canonical: "/blog",
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Blog", url: "/blog" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog Péptidos Mayoreo México",
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            datePublished: p.date,
            url: `/blog/${p.slug}`,
          })),
        },
      ],
    }),
  component: Blog,
});

function Blog() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Blog</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">
          Guías de péptidos al mayoreo en México
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Material práctico para distribuidores y revendedores: cómo arrancar, qué vender, precios reales,
          logística y errores que cuestan dinero.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {sorted.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <time dateTime={p.date}>{p.date}</time>
              <span>·</span>
              <span>{p.readingMinutes} min</span>
            </div>
            <h2 className="mt-3 font-display text-xl font-bold text-primary group-hover:underline">
              {p.title}
            </h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}