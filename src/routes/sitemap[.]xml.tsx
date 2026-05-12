import { createFileRoute } from "@tanstack/react-router";
import { allRoutes } from "@/data/routes";
import { SITE_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = allRoutes()
          .map((p) => `  <url><loc>${SITE_URL}${p}</loc><changefreq>weekly</changefreq></url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
