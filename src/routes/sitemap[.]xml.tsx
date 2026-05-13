import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/whatsapp";
import { posts } from "@/data/blog";
import { products } from "@/data/products";
import { cities } from "@/data/cities";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().slice(0, 10);

const corePages: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
  { path: "/productos", changefreq: "weekly", priority: "0.9", lastmod: today },
  { path: "/blog", changefreq: "weekly", priority: "0.9", lastmod: today },
  { path: "/como-funciona", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/empezar-negocio", changefreq: "monthly", priority: "0.8", lastmod: today },
  { path: "/distribuidor", changefreq: "monthly", priority: "0.8", lastmod: today },
  { path: "/preguntas-frecuentes", changefreq: "monthly", priority: "0.6", lastmod: today },
  { path: "/resumen-empresa", changefreq: "monthly", priority: "0.5", lastmod: today },
  { path: "/contacto", changefreq: "monthly", priority: "0.6", lastmod: today },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          ...corePages,
          ...products.map((p): SitemapEntry => ({
            path: `/productos/${p.slug}`,
            changefreq: "weekly",
            priority: "0.8",
            lastmod: today,
          })),
          ...cities.map((c): SitemapEntry => ({
            path: `/peptidos/${c.slug}`,
            changefreq: "monthly",
            priority: "0.7",
            lastmod: today,
          })),
          ...posts.map((p): SitemapEntry => ({
            path: `/blog/${p.slug}`,
            changefreq: "monthly",
            priority: "0.7",
            lastmod: p.date,
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});