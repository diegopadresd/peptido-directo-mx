import { products } from "../src/data/products.ts";
import { cities } from "../src/data/cities.ts";
import { posts } from "../src/data/blog.ts";

const SITE_URL = "https://peptidosmayoreo.com";
const today = new Date().toISOString().slice(0, 10);

const entries = [
  ["/", "weekly", "1.0"],
  ["/productos", "daily", "0.9"],
  ["/como-funciona", "monthly", "0.7"],
  ["/empezar-negocio", "monthly", "0.8"],
  ["/distribuidor", "monthly", "0.7"],
  ["/preguntas-frecuentes", "monthly", "0.6"],
  ["/contacto", "yearly", "0.4"],
  ["/resumen-empresa", "monthly", "0.6"],
  ["/blog", "weekly", "0.7"],
  ...products.map((p) => [`/productos/${p.slug}`, "weekly", "0.8"]),
  ...cities.map((c) => [`/peptidos/${c.slug}`, "monthly", "0.7"]),
  ...posts.map((p) => [`/blog/${p.slug}`, "monthly", "0.6"]),
];

const urls = entries.map(([loc, cf, pr]) =>
`  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${cf}</changefreq>
    <priority>${pr}</priority>
  </url>`).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await Bun.write("public/sitemap.xml", xml);
console.log("wrote", entries.length, "entries");
