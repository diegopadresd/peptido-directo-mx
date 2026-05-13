import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const aiBots = [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "GoogleOther",
          "Applebot-Extended",
          "Bytespider",
          "CCBot",
          "cohere-ai",
          "Meta-ExternalAgent",
          "FacebookBot",
          "Amazonbot",
          "DuckAssistBot",
        ];
        const lines = [
          "User-agent: *",
          "Allow: /",
          "Disallow: /api/",
          "",
          ...aiBots.flatMap((b) => [`User-agent: ${b}`, "Allow: /", ""]),
          `Sitemap: ${SITE_URL}/sitemap.xml`,
          `Host: ${SITE_URL.replace(/^https?:\/\//, "")}`,
          "",
        ];
        const body = lines.join("\n");
        return new Response(body, { headers: { "Content-Type": "text/plain" } });
      },
    },
  },
});
