import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { buildHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { postBySlug, posts, type BlogPost, type BlogSection } from "@/data/blog";
import { buildWaLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = postBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const p = loaderData.post;
    return buildHead({
      title: `${p.title} | Péptidos Mayoreo MX`,
      description: p.excerpt,
      canonical: `/blog/${p.slug}`,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.excerpt,
          datePublished: p.date,
          dateModified: p.date,
          author: { "@type": "Organization", name: "Péptidos Mayoreo MX" },
          publisher: {
            "@type": "Organization",
            name: "Péptidos Mayoreo MX",
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${p.slug}` },
          keywords: p.tags.join(", "),
        },
        breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: p.title, url: `/blog/${p.slug}` },
        ]),
        ...(p.faq ? [faqJsonLd(p.faq)] : []),
      ],
    });
  },
  component: Post,
});

function Post() {
  const { post } = Route.useLoaderData();
  const related = (post.related ?? [])
    .map((slug: string) => posts.find((p) => p.slug === slug))
    .filter((p: BlogPost | undefined): p is BlogPost => Boolean(p));

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
      <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">
        ← Volver al blog
      </Link>
      <header className="mt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>{post.readingMinutes} min de lectura</span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{post.intro}</p>
      </header>

      <div className="mt-10 space-y-10">
        {post.sections.map((s: BlogSection, i: number) => (
          <section key={i}>
            {s.heading && (
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{s.heading}</h2>
            )}
            {s.paragraphs?.map((p: string, j: number) => (
              <p key={j} className="mt-4 text-base leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-foreground/90">
                {s.list.map((li: string, k: number) => (
                  <li key={k}>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {post.faq && post.faq.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Preguntas frecuentes</h2>
          <dl className="mt-6 space-y-5">
            {post.faq.map((f: { q: string; a: string }, i: number) => (
              <div key={i}>
                <dt className="font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-1 text-foreground/80">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <aside className="mt-14 rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-xl font-bold">¿Listo para empezar a vender?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          MOQ 10 viales mezclados. Pago con tarjeta, OXXO o SPEI. Envío nacional con cadena de frío.
        </p>
        <a
          href={buildWaLink("Hola, vengo del blog y quiero recibir el catálogo mayoreo.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Pedir catálogo por WhatsApp
        </a>
      </aside>

      {related.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-xl font-bold">Sigue leyendo</h2>
          <ul className="mt-5 space-y-3">
            {related.map((r: BlogPost) => (
              <li key={r.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="text-primary hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}