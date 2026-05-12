import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";

const posts: Record<string, { title: string; excerpt: string; date: string; body: string[] }> = {
  "como-empezar-negocio-peptidos-mexico": {
    title: "Cómo empezar un negocio de péptidos en México en 2025",
    excerpt: "Guía completa para arrancar tu negocio de reventa de péptidos en México.",
    date: "2025-04-12",
    body: [
      "El mercado de péptidos en México creció más de 340% en los últimos dos años. Las búsquedas de productos como semaglutida, BPC-157 y tirzepatida se dispararon, y la demanda supera por mucho a la oferta confiable.",
      "Si quieres entrar al negocio, este es el momento. Aquí te explicamos cómo arrancar con menos de $5,000 MXN.",
      "1. Define tu nicho. ¿Vas a vender a coaches de gym? ¿A power users? ¿A clínicas estéticas? Cada nicho tiene productos diferentes.",
      "2. Empieza con 3-5 SKUs top. BPC-157, semaglutida e ipamorelin son los más buscados. No te disperses.",
      "3. Compra al mayoreo desde el primer día. Comprar 1-1 retail no te deja margen real. Mínimo 10 viales mezclados.",
      "4. Usa WhatsApp como tu canal principal de venta. Los mexicanos compran por WhatsApp. No pierdas tiempo construyendo checkout complejo al inicio.",
      "5. Reinvierte el 50% de las primeras ganancias en más inventario. En 3-4 ciclos puedes estar moviendo 100+ viales/mes.",
    ],
  },
};

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts[params.slug];
    if (!post) throw notFound();
    return { post, slug: params.slug };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const p = loaderData.post;
    return buildHead({
      title: `${p.title} | Péptidos Mayoreo`,
      description: p.excerpt,
      canonical: `/blog/${loaderData.slug}`,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          datePublished: p.date,
          author: { "@type": "Organization", name: "Péptidos Mayoreo" },
        },
        breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: p.title, url: `/blog/${loaderData.slug}` },
        ]),
      ],
    });
  },
  component: Post,
});

function Post() {
  const { post } = Route.useLoaderData();
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
      <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">← Volver al blog</Link>
      <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">{post.date}</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold md:text-5xl">{post.title}</h1>
      <div className="prose prose-lg mt-8 max-w-none">
        {(post.body as string[]).map((p: string, i: number) => (
          <p key={i} className="mt-5 text-base leading-relaxed text-foreground/90">{p}</p>
        ))}
      </div>
    </article>
  );
}
