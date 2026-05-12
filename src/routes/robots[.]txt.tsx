import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
        return new Response(body, { headers: { "Content-Type": "text/plain" } });
      },
    },
  },
});
