import { createFileRoute } from "@tanstack/react-router";
import { staticRoutes, blogSlugs } from "@/data/routes";
import { products } from "@/data/products";
import { cities } from "@/data/cities";
import { SITE_URL } from "@/lib/whatsapp";

type Entry = { loc: string; changefreq: string; priority: string };

function entry(loc: string, changefreq: string, priority: string): Entry {
  return { loc, changefreq, priority };
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const entries: Entry[] = [
          entry("/", "weekly", "1.0"),
          entry("/productos", "daily", "0.9"),
          entry("/como-funciona", "monthly", "0.7"),
          entry("/empezar-negocio", "monthly", "0.8"),
          entry("/distribuidor", "monthly", "0.7"),
          entry("/preguntas-frecuentes", "monthly", "0.6"),
          entry("/contacto", "yearly", "0.4"),
          entry("/resumen-empresa", "monthly", "0.6"),
          entry("/blog", "weekly", "0.7"),
          ...products.map((p) => entry(`/productos/${p.slug}`, "weekly", "0.8")),
          ...cities.map((c) => entry(`/peptidos/${c.slug}`, "monthly", "0.7")),
          ...blogSlugs.map((s) => entry(`/blog/${s}`, "monthly", "0.6")),
        ];
        // Filter out unused staticRoutes warning by referencing
        void staticRoutes;
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${SITE_URL}${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
