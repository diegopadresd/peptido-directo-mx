import { SITE_URL } from "./whatsapp";

type SeoInput = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string[];
  jsonLd?: object | object[];
  type?: "website" | "article" | "product";
};

export function buildHead(input: SeoInput) {
  const canonical = input.canonical ? `${SITE_URL}${input.canonical}` : undefined;
  const ogImage = input.ogImage ?? `${SITE_URL}/og-image.png`;
  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:image", content: ogImage },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:locale", content: "es_MX" },
    { property: "og:site_name", content: "Péptidos Mayoreo" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: ogImage },
  ];
  if (input.keywords?.length) {
    meta.push({ name: "keywords", content: input.keywords.join(", ") });
  }
  const links: Array<Record<string, string>> = [];
  if (canonical) links.push({ rel: "canonical", href: canonical });
  const scripts: Array<Record<string, string>> = [];
  if (input.jsonLd) {
    const arr = Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd];
    for (const obj of arr) {
      scripts.push({ type: "application/ld+json", children: JSON.stringify(obj) });
    }
  }
  return { meta, links, scripts };
}

export function mergeHead(...heads: ReturnType<typeof buildHead>[]) {
  return {
    meta: heads.flatMap((h) => h.meta ?? []),
    links: heads.flatMap((h) => h.links ?? []),
    scripts: heads.flatMap((h) => h.scripts ?? []),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Péptidos Mayoreo",
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    sameAs: [],
    description:
      "Distribuidor mayorista de péptidos en México. Directo de fábrica con envío a todo el país.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MX",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
